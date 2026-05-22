namespace $.$$ {

	export class $bog_quest_editor extends $.$bog_quest_editor {

		@$mol_mem
		store() { return $bog_quest_store.make({ $: this.$ }) }

		@$mol_mem
		game_link() {
			return this.$.$mol_state_arg.value('game') ?? ''
		}

		@$mol_mem
		game() {
			const link = this.game_link()
			if (!link) return null
			const games = this.store().registry().Games()?.remote_list() ?? []
			return (games.find(g => g.link().str === link) ?? null) as $bog_quest_game | null
		}

		current_panel() {
			return this.$.$mol_state_arg.value('panel') ?? ''
		}

		current_scene_key() {
			return this.$.$mol_state_arg.value('scene') ?? ''
		}

		@$mol_mem
		editor_rows() {
			if (!this.game()) return [this.No_game()]
			if (this.current_panel() === 'graph') return [this.Back_link(), this.Graph_view()]
			if (this.current_scene_key()) return [this.Back_link(), this.Scene_editor()]
			const rows: any[] = [
				this.Game_title(),
				this.Game_author(),
				this.Game_description(),
				this.Cover_section(),
				this.Characters_header(),
				...this.characters().map((_, i) => this.Character_row(String(i))),
				this.Add_character(),
				this.Scenes_header(),
				...this.scenes().map((_, i) => this.Scene_row(String(i))),
				this.Add_scene(),
				this.Graph_link(),
			]
			return rows
		}

		@$mol_mem
		cover_section() {
			return this.cover_uri()
				? [this.Cover_preview(), this.Cover_remove()]
				: [this.Cover_upload()]
		}

		@$mol_mem
		game_title(next?: string) {
			const g = this.game(); if (!g) return ''
			if (next !== undefined) { g.Title('auto')?.val(next); return next }
			return g.Title()?.val() ?? ''
		}

		@$mol_mem
		game_author(next?: string) {
			const g = this.game(); if (!g) return ''
			if (next !== undefined) { g.Author('auto')?.val(next); return next }
			return g.Author()?.val() ?? ''
		}

		@$mol_mem
		game_description(next?: string) {
			const g = this.game(); if (!g) return ''
			if (next !== undefined) { g.Description('auto')?.val(next); return next }
			return g.Description()?.val() ?? ''
		}

		@$mol_mem
		cover_uri() {
			const file = this.game()?.Cover()?.remote()
			if (!file) return ''
			return URL.createObjectURL(file.blob())
		}

		@$mol_mem
		cover_files(next?: readonly File[]) {
			if (next?.length) {
				const g = this.game()
				if (g) {
					const store = g.Cover(null)!.ensure(null)
					if (store) {
						$bog_quest_compress(next[0], 1024, 0.88).then(blob => {
							store.blob(blob)
							g.Cover(null)!.remote(store)
						})
					}
				}
			}
			return next ?? []
		}

		@$mol_action
		cover_remove() { this.game()?.Cover('auto')?.val(null) }

		@$mol_mem
		characters() {
			return this.game()?.Characters()?.remote_list() ?? []
		}

		character_at(key: string) { return this.characters()[Number(key)] as $bog_quest_character | undefined }

		@$mol_mem_key
		character_name(key: string, next?: string) {
			const ch = this.character_at(key); if (!ch) return ''
			if (next !== undefined) { ch.Name('auto')?.val(next); return next }
			return ch.Name()?.val() ?? ''
		}

		@$mol_mem_key
		character_color(key: string, next?: string) {
			const ch = this.character_at(key); if (!ch) return '#ffffff'
			if (next !== undefined) { ch.Color('auto')?.val(next); return next }
			return ch.Color()?.val() ?? '#ffffff'
		}

		@$mol_mem_key
		character_sprite_uri(key: string) {
			const file = this.character_at(key)?.Sprite()?.remote()
			if (!file) return ''
			return URL.createObjectURL(file.blob())
		}

		@$mol_mem_key
		character_sprite_files(key: string, next?: readonly File[]) {
			if (next?.length) {
				const ch = this.character_at(key)
				if (ch) {
					const store = ch.Sprite(null)!.ensure(null)
					if (store) {
						$bog_quest_compress(next[0], 800, 0.9, 'image/webp').then(blob => {
							store.blob(blob)
							ch.Sprite(null)!.remote(store)
						})
					}
				}
			}
			return next ?? []
		}

		@$mol_action
		character_delete(key: string) {
			const ch = this.character_at(key)
			const g = this.game()
			if (!ch || !g) return
			g.Characters('auto')!.cut(ch.link())
		}

		@$mol_action
		add_character() {
			const g = this.game(); if (!g) return
			const ch = g.Characters('auto')!.make(null)
			ch.Name('auto')?.val('Новый персонаж')
			ch.Color('auto')?.val('#ffffff')
		}

		@$mol_mem
		scenes() {
			return this.game()?.Scenes()?.remote_list() ?? []
		}

		scene_at(key: string) { return this.scenes()[Number(key)] as $bog_quest_scene | undefined }

		scene_key(key: string) { return this.scene_at(key)?.link()?.str ?? '' }

		scene_title(key: string) {
			return this.scene_at(key)?.Title()?.val() || `Сцена ${Number(key) + 1}`
		}

		scene_start_label(key: string) {
			const g = this.game(); const sc = this.scene_at(key)
			if (!g || !sc) return ''
			return g.Start_scene_id()?.val() === sc.link().str ? '★ старт' : ''
		}

		@$mol_action
		scene_set_start(key: string) {
			const sc = this.scene_at(key); const g = this.game()
			if (!sc || !g) return
			g.Start_scene_id('auto')?.val(sc.link().str)
		}

		@$mol_action
		scene_delete(key: string) {
			const sc = this.scene_at(key); const g = this.game()
			if (!sc || !g) return
			g.Scenes('auto')!.cut(sc.link())
		}

		@$mol_action
		add_scene() {
			const g = this.game(); if (!g) return
			const count = this.scenes().length
			const sc = g.Scenes('auto')!.make(null)
			sc.Title('auto')?.val(`Сцена ${count + 1}`)
			sc.Pos_x('auto')?.val((count % 5) * 220)
			sc.Pos_y('auto')?.val(Math.floor(count / 5) * 160)
			if (!g.Start_scene_id()?.val()) {
				g.Start_scene_id('auto')?.val(sc.link().str)
			}
		}

	}

	/** Сжатие через canvas — webp по умолчанию, для не-прозрачных подойдёт jpeg. */
	export function $bog_quest_compress(
		file: File,
		max_size = 1024,
		quality = 0.85,
		mime = 'image/webp',
	): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.onload = () => {
				let { width, height } = img
				if (width > max_size || height > max_size) {
					const ratio = Math.min(max_size / width, max_size / height)
					width = Math.round(width * ratio)
					height = Math.round(height * ratio)
				}
				const canvas = document.createElement('canvas')
				canvas.width = width
				canvas.height = height
				canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
				canvas.toBlob(
					blob => blob ? resolve(blob) : reject(new Error('compress failed')),
					mime,
					quality,
				)
			}
			img.onerror = reject
			img.src = URL.createObjectURL(file)
		})
	}

}
