namespace $.$$ {

	export class $bog_quest_home extends $.$bog_quest_home {

		@$mol_mem
		store() { return $bog_quest_store.make({ $: this.$ }) }

		@$mol_mem
		games() {
			return this.store().registry().Games()?.remote_list() ?? []
		}

		@$mol_mem
		game_rows() {
			return this.games().map((_, i) => this.Game_card(String(i)))
		}

		game_at(key: string) {
			return this.games()[Number(key)] as $bog_quest_game | undefined
		}

		game_title(key: string) {
			return this.game_at(key)?.Title()?.val() ?? '(без названия)'
		}

		game_id(key: string) {
			return this.game_at(key)?.link()?.str ?? ''
		}

		@$mol_action
		create_game() {
			const games = this.store().registry().Games('auto')!
			const count = this.games().length
			const game = games.make([[null, $giper_baza_rank_post('just')]])
			game.Title('auto')?.val(`Новая игра ${count + 1}`)
			const link = game.link().str
			this.$.$mol_state_arg.value('screen', 'edit')
			this.$.$mol_state_arg.value('game', link)
		}

		@$mol_action
		share_game(key: string) {
			const game = this.game_at(key)
			if (!game) return
			const author_link = this.store().author_land().link().str
			const game_id = game.link().str
			const loc = this.$.$mol_dom_context.location
			const url = loc.origin + loc.pathname + '?screen=play&author=' + encodeURIComponent(author_link) + '&game=' + encodeURIComponent(game_id)
			this.$.$mol_dom_context.navigator.clipboard.writeText(url)
		}

		@$mol_action
		delete_game(key: string) {
			const game = this.game_at(key)
			if (!game) return
			this.store().registry().Games('auto')!.cut(game.link())
		}

		@$mol_mem
		saves() {
			return this.store().saves().Items()?.remote_list() ?? []
		}

		@$mol_mem
		save_rows() {
			return this.saves().map((_, i) => this.Save_card(String(i)))
		}

		save_at(key: string) {
			return this.saves()[Number(key)] as $bog_quest_save | undefined
		}

		save_title(key: string) {
			const s = this.save_at(key)
			if (!s) return ''
			return s.Game_title()?.val() || '(сейв)'
		}

		save_author(key: string) {
			return this.save_at(key)?.Author_land()?.val() ?? ''
		}

		save_game(key: string) {
			return this.save_at(key)?.Game_id()?.val() ?? ''
		}

		@$mol_action
		delete_save(key: string) {
			const s = this.save_at(key)
			if (!s) return
			this.store().saves().Items('auto')!.cut(s.link())
		}

	}

}
