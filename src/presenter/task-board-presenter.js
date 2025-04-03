import TasksListComponent from '../view/list-task-component.js';
import TaskBoardComponent from '../view/area-task-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import DeleteButtonComponent from '../view/delete-button-component.js';
import LoadingViewComponent from '../view/LoadingViewComponent.js';
import TaskPresenter from './task-presenter.js';

function getTasksByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}

export default class TaskBoardPresenter {
    #boardContainer = null;
    #tasksModel = null;
    #loadingComponent = new LoadingViewComponent();
    #taskBoardComponent = new TaskBoardComponent();
    taskListComponent = new TasksListComponent();
    stubTaskComponent = null;
    #boardTasks = [];
    #isLoading = true;

    constructor({ boardContainer, tasksModel }) {
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;
        this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
    }

    async init() {
        render(this.#loadingComponent, this.#boardContainer);
        try {
            await this.#tasksModel.init();
        } finally {
            this.#isLoading = false;
            this.#loadingComponent.element.remove();
            this.#renderBoard();
        }
    }

    #renderBoard() {
        if (this.#isLoading) return;

        render(this.#taskBoardComponent, this.#boardContainer);
        this.#renderTaskList();
    }

    #renderTask(task, container) {
        const taskPresenter = new TaskPresenter(task, container);
        taskPresenter.renderTask();
    }

    #renderIfEmpty(tasks, container) {
        TaskPresenter.renderIfEmpty(tasks, container);
    }

    #renderTaskList() {
        Object.values(Status).forEach((status) => {
            const tasksListComponent = new TasksListComponent({
                status: status,
                statusLabel: StatusLabel[status],
                onTaskDrop: this.#handleTaskDrop.bind(this),
            });

            render(tasksListComponent, this.#taskBoardComponent.element);
            tasksListComponent.afterRender();

            const tasksForStatus = getTasksByStatus(this.#boardTasks, status).sort(
                (a, b) => this.#boardTasks.indexOf(a) - this.#boardTasks.indexOf(b)
            );

            this.#renderIfEmpty(tasksForStatus, tasksListComponent.element);

            tasksForStatus.forEach((task) => {
                this.#renderTask(task, tasksListComponent.element);
            });

            if (status === 'basket') {
                this.#renderResetButton(tasksListComponent);
            }
        });
    }

    

    #renderResetButton(tasksListComponent) {
        const deleteButtonComponent = new DeleteButtonComponent({
            onClick: this.#deleteBasketTasks.bind(this),
        });
    
       
        const basketTasks = this.#tasksModel.getTasksByStatus('basket');
        const isButtonDisabled = basketTasks.length === 0;
    
        
        clearButtonComponent.setDisabled(isButtonDisabled);
    
       
        render(deleteButtonComponent, tasksListComponent.element);
    }
    

    async #deleteBasketTasks() {
        try {
            this.#tasksModel.clearRecycleBin();
            this.#handleModelChange();
        } catch (err) {
            console.error('Ошибка ', err);
            throw err;
        }
    }

    #handleModelChange() {
        this.#boardTasks = [...this.#tasksModel.tasks];
        this.#deleteBoard();
        this.#renderBoard();
    }

    #deleteBoard() {
        this.#taskBoardComponent.element.innerHTML = '';
    }

    async createTask() {
        const taskTitle = document.querySelector('.form_text').value.trim();
        if (!taskTitle) return;

        try {
            await this.#tasksModel.addTask(taskTitle);
            document.querySelector('.form_text').value = '';
        } catch (err) {
            console.error('Ошибка при создании задачи', err);
        }
    }

    #handleTaskDrop(taskId, newStatus, newIndex) {
        this.#tasksModel.updateTaskStatus(taskId, newStatus, newIndex);
        this.#handleModelChange();
    }
}