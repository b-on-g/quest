namespace $.$$ {

	export class $bog_quest_player extends $.$bog_quest_player {

		@$mol_mem
		store() { return $bog_quest_store.make({ $: this.$ }) }

		@$mol_mem
		author_link() { return this.$.$mol_state_arg.value('author') ?? '' }

		@$mol_mem
		game_id() { return this.$.$mol_state_arg.value('game') ?? '' }

		@$mol_mem
		registry() {
			const link = this.author_link()
			if (!link) return null
			return this.store().foreign_author(link)
		}

		@$mol_mem
		game() {
			const reg = this.registry(); const id = this.game_id()
			if (!reg || !id) return null
			const games = reg.Games()?.remote_list() ?? []
			return (games.find(g => g.link().str === id) ?? null) as $bog_quest_game | null
		}

		@$mol_mem
		save() {
			const author = this.author_link(); const id = this.game_id()
			if (!author || !id) return null
			const items = this.store().saves().Items()?.remote_list() ?? []
			let found = items.find(s => {
				const sv = s as $bog_quest_save
				return sv.Author_land()?.val() === author && sv.Game_id()?.val() === id
			}) as $bog_quest_save | undefined
			if (!found) {
				const game = this.game()
				if (!game) return null
				const start = game.Start_scene_id()?.val() ?? ''
				if (!start) return null
				const sv = this.store().saves().Items('auto')!.make(null) as $bog_quest_save
				sv.Author_land('auto')?.val(author)
				sv.Game_id('auto')?.val(id)
				sv.Game_title('auto')?.val(game.Title()?.val() ?? '')
				sv.Current_scene_id('auto')?.val(start)
				sv.Line_index('auto')?.val(0)
				sv.History('auto')?.val('[]')
				sv.Updated('auto')?.val(Date.now())
				found = sv
			}
			return found
		}

		@$mol_mem
		current_scene() {
			const game = this.game(); const save = this.save()
			if (!game || !save) return null
			const sid = save.Current_scene_id()?.val()
			if (!sid) return null
			const scenes = game.Scenes()?.remote_list() ?? []
			return (scenes.find(s => s.link().str === sid) ?? null) as $bog_quest_scene | null
		}

		@$mol_mem
		current_lines() {
			return this.current_scene()?.Lines()?.remote_list() ?? []
		}

		@$mol_mem
		current_line() {
			const lines = this.current_lines()
			const i = this.save()?.Line_index()?.val() ?? 0
			return (lines[i] ?? null) as $bog_quest_line | null
		}

		@$mol_mem
		current_choices() {
			return this.current_scene()?.Choices()?.remote_list() ?? []
		}

		@$mol_mem
		game_ended() {
			const save = this.save(); if (!save) return false
			return save.Current_scene_id()?.val() === '__end__'
		}

		@$mol_mem
		lines_done() {
			const i = this.save()?.Line_index()?.val() ?? 0
			return i >= this.current_lines().length
		}

		@$mol_mem
		player_sub() {
			if (!this.game()) {
				if (!this.author_link() || !this.game_id()) return [this.Not_found()]
				return [this.Loading()]
			}
			if (this.game_ended()) return [this.End_screen()]
			const sub: any[] = [this.Stage()]
			if (this.lines_done()) {
				if (this.current_choices().length === 0) {
					sub.push(this.End_screen())
				} else {
					sub.push(this.Choices_panel())
				}
			} else {
				sub.push(this.Textbox())
			}
			return sub
		}

		@$mol_mem
		stage_bg() {
			const f = this.current_scene()?.Background()?.remote()
			return f ? `url(${URL.createObjectURL(f.blob())})` : 'none'
		}

		character_by_id(id: string) {
			const chars = this.game()?.Characters()?.remote_list() ?? []
			return (chars.find(c => c.link().str === id) ?? null) as $bog_quest_character | null
		}

		sprite_uri_for(position: 'left' | 'center' | 'right') {
			const line = this.current_line()
			if (!line) return ''
			const pos = line.Position()?.val() ?? 'center'
			if (pos !== position) return ''
			const ch_id = line.Character_id()?.val()
			if (!ch_id) return ''
			const ch = this.character_by_id(ch_id)
			const file = ch?.Sprite()?.remote()
			return file ? URL.createObjectURL(file.blob()) : ''
		}

		@$mol_mem
		sprite_uri_left() { return this.sprite_uri_for('left') }

		@$mol_mem
		sprite_uri_center() { return this.sprite_uri_for('center') }

		@$mol_mem
		sprite_uri_right() { return this.sprite_uri_for('right') }

		@$mol_mem
		speaker_name() {
			const line = this.current_line()
			if (!line) return ''
			const ch_id = line.Character_id()?.val()
			if (!ch_id) return ''
			return this.character_by_id(ch_id)?.Name()?.val() ?? ''
		}

		@$mol_mem
		speaker_color() {
			const line = this.current_line()
			if (!line) return '#ffffff'
			const ch_id = line.Character_id()?.val()
			if (!ch_id) return '#ffffff'
			return this.character_by_id(ch_id)?.Color()?.val() ?? '#ffffff'
		}

		@$mol_mem
		current_text() {
			return this.current_line()?.Text()?.val() ?? ''
		}

		@$mol_mem
		choice_rows() {
			return this.current_choices().map((_, i) => this.Choice_button(String(i)))
		}

		choice_label(key: string) {
			const c = this.current_choices()[Number(key)] as $bog_quest_choice | undefined
			return c?.Text()?.val() ?? ''
		}

		@$mol_action
		pick_choice(key: string) {
			const c = this.current_choices()[Number(key)] as $bog_quest_choice | undefined
			const save = this.save(); if (!c || !save) return
			const next_id = c.Next_scene_id()?.val()
			const history_raw = save.History()?.val() ?? '[]'
			let history: any[] = []
			try { history = JSON.parse(history_raw) } catch {}
			history.push({
				scene_id: save.Current_scene_id()?.val(),
				choice_index: Number(key),
				choice_text: c.Text()?.val(),
			})
			save.History('auto')?.val(JSON.stringify(history))
			save.Current_scene_id('auto')?.val(next_id || '__end__')
			save.Line_index('auto')?.val(0)
			save.Updated('auto')?.val(Date.now())
		}

		@$mol_action
		advance() {
			const save = this.save(); if (!save) return
			const i = save.Line_index()?.val() ?? 0
			save.Line_index('auto')?.val(i + 1)
			save.Updated('auto')?.val(Date.now())
		}

		@$mol_action
		restart() {
			const save = this.save(); const game = this.game()
			if (!save || !game) return
			save.Current_scene_id('auto')?.val(game.Start_scene_id()?.val() ?? '')
			save.Line_index('auto')?.val(0)
			save.History('auto')?.val('[]')
			save.Updated('auto')?.val(Date.now())
		}

	}

}
