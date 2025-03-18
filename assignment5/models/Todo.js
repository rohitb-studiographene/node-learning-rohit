class Todo {
  constructor(title, completed = false) {
    this.id = Date.now().toString();
    this.title = title;
    this.completed = completed;
  }
}

module.exports = Todo;
