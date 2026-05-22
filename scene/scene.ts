namespace $ {

	/**
	 * Реплика — кто говорит и что говорит.
	 * Character_id — id sub-pawn персонажа в game.Characters (или '' для narrator).
	 * Position — слева/в центре/справа (для рендера спрайта на сцене).
	 */
	export class $bog_quest_line extends $giper_baza_dict.with({
		Character_id: $giper_baza_atom_text,
		Text: $giper_baza_atom_text,
		Position: $giper_baza_atom_text,
	}) {}

	/** Выбор — текст кнопки + id следующей сцены. */
	export class $bog_quest_choice extends $giper_baza_dict.with({
		Text: $giper_baza_atom_text,
		Next_scene_id: $giper_baza_atom_text,
	}) {}

	/**
	 * Сцена: фон, музыка, последовательность реплик, набор выборов в конце.
	 * Pos_x/Pos_y — координаты узла в графовом редакторе.
	 */
	export class $bog_quest_scene extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Background: $giper_baza_atom_link_to(() => $giper_baza_file),
		Music: $giper_baza_atom_link_to(() => $giper_baza_file),
		Lines: $giper_baza_list_link_to(() => $bog_quest_line),
		Choices: $giper_baza_list_link_to(() => $bog_quest_choice),
		Pos_x: $giper_baza_atom_real,
		Pos_y: $giper_baza_atom_real,
	}) {}

}
