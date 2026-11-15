const prompt = require("prompt-sync")();


class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getRole() {
    return "Employee";
  }

  getBonus() {
    return this.salary * 0.05;
  }
}

class Manager extends Employee {
  getRole() {
    return "Manager";
  }

  getBonus() {
    return this.salary * 0.2;
  }
}

class Developer extends Employee {
  getRole() {
    return "Developer";
  }

  getBonus() {
    return this.salary * 0.1;
  }
}

class Intern extends Employee {
  getRole() {
    return "Intern";
  }

  getBonus() {
    return 0;
  }
}

const empList = [];
const numEmployees = parseInt(prompt("Enter number of employees:"), 10);

for (let i = 0; i < numEmployees; i++) {
  let name = prompt(`Enter name of employee ${i + 1}:`);
  let salary = parseFloat(prompt(`Enter salary of ${name}:`));
  let role = prompt(`Enter role of ${name} (Manager/Developer/Intern):`);

  if (role.toLowerCase() === "manager") {
    empList.push(new Manager(name, salary));
  } else if (role.toLowerCase() === "developer") {
    empList.push(new Developer(name, salary));
  } else {
    empList.push(new Intern(name, salary));
  }
}

empList.forEach(emp => {
  console.log(`${emp.name} is a ${emp.getRole()} and gets a bonus of $${emp.getBonus()}`);
});
