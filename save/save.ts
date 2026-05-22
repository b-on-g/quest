namespace $ {

	/**
	 * Сейв игрока в одной игре.
	 * Author_land + Game_id однозначно адресуют игру.
	 * History — JSON-массив [{ scene_id, choice_index, choice_text }] (для UI типа «какие развилки прошёл»).
	 * Flags — JSON-объект произвольных булевых/числовых флагов сценарного состояния.
	 */
	export class $bog_quest_save extends $giper_baza_dict.with({
		Author_land: $giper_baza_atom_text,
		Game_id: $giper_baza_atom_text,
		Game_title: $giper_baza_atom_text,
		Current_scene_id: $giper_baza_atom_text,
		Line_index: $giper_baza_atom_real,
		History: $giper_baza_atom_text,
		Flags: $giper_baza_atom_text,
		Updated: $giper_baza_atom_real,
	}) {}

}
