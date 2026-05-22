namespace $ {

	/** Персонаж: имя + спрайт + цвет имени в текстбоксе */
	export class $bog_quest_character extends $giper_baza_dict.with({
		Name: $giper_baza_atom_text,
		Color: $giper_baza_atom_text,
		Sprite: $giper_baza_atom_link_to(() => $giper_baza_file),
	}) {}

}
