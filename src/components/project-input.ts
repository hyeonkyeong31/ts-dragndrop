import { Component } from "./base-component";
import { Validatable, validate } from "../util/validation";
import { projectState } from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		super("project-input", "app", true, "user-input");

		this.titleInputElement = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector(
			"#people"
		) as HTMLInputElement;
		this.configure();
	}
	configure() {
		this.element.addEventListener("submit", this.submitHandler.bind(this)); //this 를 바인드 해도 되지만 데코레이터를 써보자
	}

	renderContent(): void {}

	private gatherUserInput(): [string, string, number] | void {
		const enterdTitle = this.titleInputElement.value;
		const enterdDescription = this.descriptionInputElement.value;
		const enterdPeople = this.peopleInputElement.value;

		const titleValidatable: Validatable = {
			value: enterdTitle,
			require: true,
		};
		const descriptionValidatable: Validatable = {
			value: enterdDescription,
			require: true,
			minLength: 5,
		};
		const peopleValidatable: Validatable = {
			value: +enterdPeople,
			require: true,
			min: 1,
			max: 5,
		};

		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert("Invalid input, please try again");
		} else {
			return [enterdTitle, enterdDescription, +enterdPeople];
		}
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.peopleInputElement.value = "";
	}

	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			projectState.addProject(title, desc, people);
			console.log(title, desc, people);
		}
		this.clearInputs();
	}
}
