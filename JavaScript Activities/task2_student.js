const prompt = require("prompt-sync")();

class Student {
  #grades = [];

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  set addGrade(grade) {
    if (grade >= 0 && grade <= 100) {
      this.#grades.push(grade);
    } else {
      console.log("Invalid grade");
    }
  }

  get average() {
    const sum = this.#grades.reduce((a, b) => a + b, 0);
    return (sum / this.#grades.length).toFixed(2);
  }

  getGrades() {
    return this.#grades;
  }
}

const name = prompt("Enter student name:");
const id = prompt("Enter student ID:");
const student1 = new Student(name, id);

const numberOfGrades = parseInt(prompt("How many grades will you enter?"), 10);
for (let i = 0; i < numberOfGrades; i++) {
  let grade = parseInt(prompt(`Enter grade ${i + 1}:`), 10);
  student1.addGrade = grade;
}

console.log(`Average: ${student1.average}`);
