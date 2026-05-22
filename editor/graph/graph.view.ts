namespace $.$$ {

	const NODE_W = 180
	const NODE_H = 80

	export class $bog_quest_editor_graph extends $.$bog_quest_editor_graph {

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
		scenes() {
			return this.game()?.Scenes()?.remote_list() ?? []
		}

		@$mol_mem
		scene_pos() {
			const map = new Map<string, { x: number; y: number }>()
			for (const s of this.scenes()) {
				const sc = s as $bog_quest_scene
				const x = sc.Pos_x()?.val() ?? 0
				const y = sc.Pos_y()?.val() ?? 0
				map.set(sc.link().str, { x, y })
			}
			return map
		}

		@$mol_mem
		viewbox() {
			let max_x = 800, max_y = 600
			for (const p of this.scene_pos().values()) {
				if (p.x + NODE_W + 40 > max_x) max_x = p.x + NODE_W + 40
				if (p.y + NODE_H + 40 > max_y) max_y = p.y + NODE_H + 40
			}
			return `0 0 ${max_x} ${max_y}`
		}

		@$mol_mem
		edges() {
			const list: { from: string; to: string; index: number }[] = []
			let i = 0
			for (const s of this.scenes()) {
				const sc = s as $bog_quest_scene
				const choices = sc.Choices()?.remote_list() ?? []
				for (const c of choices) {
					const ch = c as $bog_quest_choice
					const next = ch.Next_scene_id()?.val()
					if (next) {
						list.push({ from: sc.link().str, to: next, index: i++ })
					}
				}
			}
			return list
		}

		@$mol_mem
		graph_sub() {
			const sub: any[] = [this.Arrow_defs()]
			const edges = this.edges()
			for (let i = 0; i < edges.length; i++) {
				sub.push(this.Edge(String(i)))
			}
			const scenes = this.scenes()
			for (let i = 0; i < scenes.length; i++) {
				sub.push(this.Node_group(String(i)))
			}
			return sub
		}

		edge_x1(key: string) {
			const e = this.edges()[Number(key)]; if (!e) return 0
			const p = this.scene_pos().get(e.from); return p ? p.x + NODE_W : 0
		}
		edge_y1(key: string) {
			const e = this.edges()[Number(key)]; if (!e) return 0
			const p = this.scene_pos().get(e.from); return p ? p.y + NODE_H / 2 : 0
		}
		edge_x2(key: string) {
			const e = this.edges()[Number(key)]; if (!e) return 0
			const p = this.scene_pos().get(e.to); return p ? p.x : 0
		}
		edge_y2(key: string) {
			const e = this.edges()[Number(key)]; if (!e) return 0
			const p = this.scene_pos().get(e.to); return p ? p.y + NODE_H / 2 : 0
		}

		scene_at(key: string) { return this.scenes()[Number(key)] as $bog_quest_scene | undefined }

		node_transform(key: string) {
			const sc = this.scene_at(key); if (!sc) return 'translate(0 0)'
			const x = sc.Pos_x()?.val() ?? 0
			const y = sc.Pos_y()?.val() ?? 0
			return `translate(${x} ${y})`
		}

		node_label(key: string) {
			const sc = this.scene_at(key); if (!sc) return ''
			const title = sc.Title()?.val() || `Сцена ${Number(key) + 1}`
			return title.length > 22 ? title.slice(0, 20) + '…' : title
		}

		node_stroke(key: string) {
			const sc = this.scene_at(key); const g = this.game()
			if (!sc || !g) return '#444'
			return g.Start_scene_id()?.val() === sc.link().str ? '#fbbf24' : '#444'
		}

		@$mol_action
		node_click(key: string) {
			const sc = this.scene_at(key); if (!sc) return
			this.$.$mol_state_arg.value('scene', sc.link().str)
			this.$.$mol_state_arg.value('panel', null)
		}

	}

}
