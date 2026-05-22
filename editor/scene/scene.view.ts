namespace $.$$ {

	export class $bog_quest_editor_scene extends $.$bog_quest_editor_scene {

		@$mol_mem
		store() { return $bog_quest_store.make({ $: this.$ }) }

		@$mol_mem
		game() {
			const link = this.game_link()
			if (!link) return null
			const games = this.store().registry().Games()?.remote_list() ?? []
			return (games.find(g => g.link().str === link) ?? null) as $bog_quest_game | null
		}

		@$mol_mem
		scene() {
			const key = this.scene_key(); const g = this.game()
			if (!key || !g) return null
			const scenes = g.Scenes()?.remote_list() ?? []
			return (scenes.find(s => s.link().str === key) ?? null) as $bog_quest_scene | null
		}

		@$mol_mem
		scene_rows() {
			if (!this.scene()) return []
			const rows: any[] = [
				this.Scene_title(),
				this.Bg_section(),
				this.Lines_header(),
				...this.lines().map((_, i) => this.Line_row(String(i))),
				this.Add_line(),
				this.Choices_header(),
				...this.choices().map((_, i) => this.Choice_row(String(i))),
				this.Add_choice(),
			]
			return rows
		}

		@$mol_mem
		bg_section() {
			return this.bg_uri()
				? [this.Bg_preview(), this.Bg_remove()]
				: [this.Bg_upload()]
		}

		@$mol_mem
		scene_title(next?: string) {
			const s = this.scene(); if (!s) return ''
			if (next !== undefined) { s.Title('auto')?.val(next); return next }
			return s.Title()?.val() ?? ''
		}

		@$mol_mem
		bg_uri() {
			const f = this.scene()?.Background()?.remote()
			return f ? URL.createObjectURL(f.blob()) : ''
		}

		@$mol_mem
		bg_files(next?: readonly File[]) {
			if (next?.length) {
				const s = this.scene()
				if (s) {
					const store = s.Background(null)!.ensure(null)
					if (store) {
						$bog_quest_compress(next[0], 1920, 0.88, 'image/webp').then(blob => {
							store.blob(blob)
							s.Background(null)!.remote(store)
						})
					}
				}
			}
			return next ?? []
		}

		@$mol_action
		bg_remove() { this.scene()?.Background('auto')?.val(null) }

		@$mol_mem
		character_options() {
			const dict: Record<string, string> = { '': 'Рассказчик' }
			const chars = this.game()?.Characters()?.remote_list() ?? []
			for (const c of chars) {
				const ch = c as $bog_quest_character
				dict[ch.link().str] = ch.Name()?.val() || '(без имени)'
			}
			return dict
		}

		@$mol_mem
		scene_options() {
			const dict: Record<string, string> = { '': '(конец игры)' }
			const scenes = this.game()?.Scenes()?.remote_list() ?? []
			for (const s of scenes) {
				const sc = s as $bog_quest_scene
				dict[sc.link().str] = sc.Title()?.val() || '(без названия)'
			}
			return dict
		}

		@$mol_mem
		lines() {
			return this.scene()?.Lines()?.remote_list() ?? []
		}

		line_at(key: string) { return this.lines()[Number(key)] as $bog_quest_line | undefined }

		@$mol_mem_key
		line_character(key: string, next?: string) {
			const l = this.line_at(key); if (!l) return ''
			if (next !== undefined) { l.Character_id('auto')?.val(next); return next }
			return l.Character_id()?.val() ?? ''
		}

		@$mol_mem_key
		line_position(key: string, next?: string) {
			const l = this.line_at(key); if (!l) return 'center'
			if (next !== undefined) { l.Position('auto')?.val(next); return next }
			return l.Position()?.val() ?? 'center'
		}

		@$mol_mem_key
		line_text(key: string, next?: string) {
			const l = this.line_at(key); if (!l) return ''
			if (next !== undefined) { l.Text('auto')?.val(next); return next }
			return l.Text()?.val() ?? ''
		}

		@$mol_action
		line_delete(key: string) {
			const l = this.line_at(key); const s = this.scene()
			if (!l || !s) return
			s.Lines('auto')!.cut(l.link())
		}

		@$mol_action
		add_line() {
			const s = this.scene(); if (!s) return
			const l = s.Lines('auto')!.make(null)
			l.Position('auto')?.val('center')
		}

		@$mol_mem
		choices() {
			return this.scene()?.Choices()?.remote_list() ?? []
		}

		choice_at(key: string) { return this.choices()[Number(key)] as $bog_quest_choice | undefined }

		@$mol_mem_key
		choice_text(key: string, next?: string) {
			const c = this.choice_at(key); if (!c) return ''
			if (next !== undefined) { c.Text('auto')?.val(next); return next }
			return c.Text()?.val() ?? ''
		}

		@$mol_mem_key
		choice_next(key: string, next?: string) {
			const c = this.choice_at(key); if (!c) return ''
			if (next !== undefined) { c.Next_scene_id('auto')?.val(next); return next }
			return c.Next_scene_id()?.val() ?? ''
		}

		@$mol_action
		choice_delete(key: string) {
			const c = this.choice_at(key); const s = this.scene()
			if (!c || !s) return
			s.Choices('auto')!.cut(c.link())
		}

		@$mol_action
		add_choice() {
			const s = this.scene(); if (!s) return
			s.Choices('auto')!.make(null)
		}

	}

}
