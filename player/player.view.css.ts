namespace $ {

	$mol_style_define($bog_quest_player, {
		position: 'relative',
		flex: { direction: 'column' },
		minHeight: '100vh',
		backgroundColor: '#000',
		color: '#fff',

		Stage: {
			position: 'relative',
			flex: { grow: 1 },
			minHeight: '60vh',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			overflow: 'hidden',
		},

		Sprite_left: {
			position: 'absolute',
			left: 0,
			bottom: 0,
			height: '90%',
			maxWidth: '30%',
			objectFit: 'contain',
			objectPosition: 'left bottom',
		},

		Sprite_center: {
			position: 'absolute',
			left: '50%',
			bottom: 0,
			transform: 'translateX(-50%)',
			height: '95%',
			maxWidth: '40%',
			objectFit: 'contain',
			objectPosition: 'center bottom',
		},

		Sprite_right: {
			position: 'absolute',
			right: 0,
			bottom: 0,
			height: '90%',
			maxWidth: '30%',
			objectFit: 'contain',
			objectPosition: 'right bottom',
		},

		Textbox: {
			position: 'absolute',
			left: '5%',
			right: '5%',
			bottom: '5%',
			padding: { top: '1.5rem', bottom: '1.5rem', left: '2rem', right: '2rem' },
			backgroundColor: '#000000d0',
			color: '#fff',
			border: { radius: $mol_gap.round },
			cursor: 'pointer',
			flex: { direction: 'column' },
			gap: $mol_gap.text,
			minHeight: '8rem',
		},

		Speaker_name: {
			font: { weight: 'bold', size: '1.1rem' },
		},

		Line_text: {
			font: { size: '1.05rem' },
			whiteSpace: 'pre-wrap',
		},

		Hint: {
			font: { size: '0.75rem' },
			color: '#aaa',
			textAlign: 'right',
		},

		Choices_panel: {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			flex: { direction: 'column' },
			gap: $mol_gap.block,
			minWidth: '20rem',
		},

		End_screen: {
			flex: { direction: 'column' },
			gap: $mol_gap.block,
			justify: { content: 'center' },
			align: { items: 'center' },
			padding: { top: '3rem', bottom: '3rem', left: '2rem', right: '2rem' },
		},
	})

}
