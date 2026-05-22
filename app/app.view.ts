namespace $.$$ {

	export class $bog_quest_app extends $.$bog_quest_app {

		@$mol_mem
		store() {
			return $bog_quest_store.make({ $: this.$ })
		}

		@$mol_mem
		screen(next?: string) {
			const arg = $mol_state_arg.value('screen', next) ?? ''
			if (arg) return arg
			// если в URL есть ?author=... — это play-режим
			if ($mol_state_arg.value('author')) return 'play'
			return 'home'
		}

		@$mol_mem
		screen_body() {
			const pages = this.pages()
			const screen = this.screen()
			const page = (pages as any)[screen]
			return page ? [page] : []
		}

	}

}
