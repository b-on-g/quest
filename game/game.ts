namespace $ {

	/**
	 * Игра — корневая сущность.
	 * Start_scene_id — id sub-pawn первой сцены в Scenes.
	 */
	export class $bog_quest_game extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Description: $giper_baza_atom_text,
		Author: $giper_baza_atom_text,
		Cover: $giper_baza_atom_link_to(() => $giper_baza_file),
		Start_scene_id: $giper_baza_atom_text,
		Scenes: $giper_baza_list_link_to(() => $bog_quest_scene),
		Characters: $giper_baza_list_link_to(() => $bog_quest_character),
	}) {}

}
