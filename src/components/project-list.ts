import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { Component } from "./base-component";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";

//ProjectList Class
export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	assignedProjects: Project[];

	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`); //super를 호출해서 베이스 클래스의 생성자를 호출해야한다.
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	dragOverHandler(event: DragEvent) {
		if (
			event.dataTransfer &&
			event.dataTransfer.types[0] === "text/plain"
		) {
			event.preventDefault();
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.add("droppable");
		}
	}
	dropHandler(event: DragEvent) {
		const prjId = event.dataTransfer!.getData("text/plain");
		projectState.moveProject(
			prjId,
			this.type === "active"
				? ProjectStatus.Active
				: ProjectStatus.Finished
		);
	}

	dragLeaveHandler(_: DragEvent) {
		const listEL = this.element.querySelector("ul")!;
		listEL.classList.remove("dropppable");
	}

	configure() {
		this.element.addEventListener(
			"dragover",
			this.dragOverHandler.bind(this)
		);
		this.element.addEventListener(
			"dragleave",
			this.dragLeaveHandler.bind(this)
		);
		this.element.addEventListener("drop", this.dropHandler.bind(this));
		projectState.addListner((projects: Project[]) => {
			const relevantProjects = projects.filter((prj) => {
				if (this.type === "active") {
					return prj.status === ProjectStatus.Active;
				}
				return prj.status === ProjectStatus.Finished;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}
	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		listEl.innerHTML = "";
		for (const prjItem of this.assignedProjects) {
			new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
		}
	}
}
