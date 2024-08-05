// Component Base Class 직접 인스턴스화 하지않고 항상 상속을위해 사용하게 할것임으로 추상클래스로 만들것
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		temmplateId: string,
		hostElemetId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.templateElement = document.getElementById(
			temmplateId
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElemetId)! as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}
		this.attach(insertAtStart);
	}
	private attach(insertAtBeginning: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}
	abstract configure(): void; //구체적인 구현물이 없다. 구체적인 콘텐츠와 설정은 우리가 상속받은곳에서 이루어져야 한다.
	abstract renderContent(): void;
}
