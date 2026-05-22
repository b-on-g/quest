namespace $ {

	/**
	 * Указатель в home_land — ссылки на public-read «author» ленд (мои игры)
	 * и приватный «saves» ленд (мой прогресс по чужим играм).
	 */
	export class $bog_quest_home_ref extends $giper_baza_dict.with({
		Author_land: $giper_baza_atom_text,
		Saves_land: $giper_baza_atom_text,
	}) {}

	/** Реестр игр автора, лежит в public-read author-ленде. */
	export class $bog_quest_registry extends $giper_baza_dict.with({
		Games: $giper_baza_list_link_to(() => $bog_quest_game),
	}) {}

	/** Список сейвов игрока, лежит в приватном saves-ленде. */
	export class $bog_quest_saves extends $giper_baza_dict.with({
		Items: $giper_baza_list_link_to(() => $bog_quest_save),
	}) {}

	export class $bog_quest_store extends $mol_object {

		glob() {
			return this.$.$giper_baza_glob
		}

		home_land() {
			return this.glob().home().land()
		}

		home_ref() {
			return this.home_land().Data($bog_quest_home_ref) as $bog_quest_home_ref
		}

		/** Public-read author ленд для моих игр (lazy create при первом обращении). */
		@$mol_action
		author_land_make() {
			const land = this.glob().land_grab([
				[null, $giper_baza_rank_read],
			])
			this.home_ref().Author_land('auto')?.val(land.link().str)
			return land
		}

		@$mol_mem
		author_land() {
			const link_str = this.home_ref().Author_land()?.val()
			if (!link_str) return this.author_land_make()
			return this.glob().Land(new $giper_baza_link(link_str))
		}

		@$mol_mem
		registry() {
			return this.author_land().Data($bog_quest_registry) as $bog_quest_registry
		}

		/** Приватный saves ленд. */
		@$mol_action
		saves_land_make() {
			const land = this.glob().land_grab([
				[null, $giper_baza_rank_deny],
			])
			this.home_ref().Saves_land('auto')?.val(land.link().str)
			return land
		}

		@$mol_mem
		saves_land() {
			const link_str = this.home_ref().Saves_land()?.val()
			if (!link_str) return this.saves_land_make()
			return this.glob().Land(new $giper_baza_link(link_str))
		}

		@$mol_mem
		saves() {
			return this.saves_land().Data($bog_quest_saves) as $bog_quest_saves
		}

		/** Загрузить чужой author ленд по link-строке (для player режима). */
		foreign_author(link_str: string) {
			const land = this.glob().Land(new $giper_baza_link(link_str))
			return land.Data($bog_quest_registry) as $bog_quest_registry
		}

	}

}
