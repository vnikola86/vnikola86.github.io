tableBody = document.querySelector("tbody");

const addFirstName = document.getElementById("addFirstName");
const addLastName = document.getElementById("addLastName");
const addDateOfBirth = document.getElementById("addDateOfBirth");
const addScore = document.getElementById("addScore");
const addEmailAddress = document.getElementById("addEmailAddress");
const addPhoneNumber = document.getElementById("addPhoneNumber");
const addTraining = document.getElementById("addTraining");

const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("searchBtn");

const addNewStudentBtn = document.getElementById("addNewStudentBtn");

const addNewTrainingBtn = document.getElementById('addNewTrainingBtn');
const addTrainingName = document.getElementById('addTrainingName');
const previousTrainings = document.getElementById('previousTrainings');

const exportBtn = document.getElementById('exportBtn');
const restoreDBInput = document.getElementById('restoreDBInput');

const addStudentForm = document.getElementById("addStudentForm");
const addTrainingForm = document.getElementById('addTrainingForm');
const editStudentForm = document.getElementById("editStudentForm");

const addStudentCancelBtn = document.getElementById("addStudentCancel");

const editFirstName = document.getElementById("editFirstName");
const editLastName = document.getElementById("editLastName");
const editDateOfBirth = document.getElementById("editDateOfBirth");
const editScore = document.getElementById("editScore");
const editEmailAddress = document.getElementById("editEmailAddress");
const editPhoneNumber = document.getElementById("editPhoneNumber");
const editTraining = document.getElementById("editTraining");


const addStudentModal = new bootstrap.Modal(document.getElementById("addStudentModal"), {
    keyboard: false
  })

const addTrainingModal = new bootstrap.Modal(document.getElementById('addTrainingModal'), {
  keyboard: false
})

const editStudentModal = new bootstrap.Modal(document.getElementById("editStudentModal"), {
    keyboard: false
  })

let addStudentsLock;

let tableActive = false;

let searchTimer;
let previousStudents = [];


// Sample data
const students = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01',
    emailAddress: 'john.doe@example.com',
    phoneNumber: '555-11111',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1995-02-01',
    emailAddress: 'jane.smith@example.com',
    phoneNumber: '555-22222',
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Johnson',
    dateOfBirth: '1990-03-01',
    emailAddress: 'david.johnson@example.com',
    phoneNumber: '555-33333',
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1985-04-01',
    emailAddress: 'emily.davis@example.com',
    phoneNumber: '555-44444',
  },
  {
    id: 5,
    firstName: 'Michael',
    lastName: 'Wilson',
    dateOfBirth: '1980-05-01',
    emailAddress: 'michael.wilson@example.com',
    phoneNumber: '555-55555',
  }
];

const trainings = [
  {
    id: 1,
    trainingName: 'Web developement'
  },
  {
    id: 2,
    trainingName: 'Android developement'
  },
  {
    id: 3,
    trainingName: 'iOS development'
  },
  {
    id: 4,
    trainingName: 'Game development'
  },
  {
    id: 5,
    trainingName: 'Marketing'
  },
  {
    id: 6,
    trainingName: 'Game design'
  },
  {
    id: 7,
    trainingName: 'Agile methodology'
  },
  {
    id: 8,
    trainingName: 'Salesforce Development'
  },
  {
    id: 9,
    trainingName: 'Manual testing'
  },
  {
    id: 10,
    trainingName: 'Winter session coding'
  }
];

const testScores = [
  {
    id: 1,
    studentId: 1,
    trainingId: 1,
    score: 50
  },
  {
    id: 2,
    studentId: 2,
    trainingId: 2,
    score: 60
  },
  {
    id: 3,
    studentId: 3,
    trainingId: 3,
    score: 70
  },
  {
    id: 4,
    studentId: 4,
    trainingId: 4,
    score: 80
  },
  {
    id: 5,
    studentId: 5,
    trainingId: 5,
    score: 90
  },
  {
    id: 6,
    studentId: 1,
    trainingId: 2,
    score: 75
  }
];


// Exports the database as a ZIP file
const exportDatabase = () => {
  const zip = new JSZip();

  // Backup students data
  fetch('http://localhost:8082/api/v1/students', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((students) => {
      const studentsCSV = convertToCSV(students, ['id', 'firstName', 'lastName', 'dateOfBirth', 'emailAddress', 'phoneNumber']);
      zip.file('students.csv', studentsCSV);
      checkAllFilesAdded();
    })
    .catch((error) => {
      console.error('Error backing up students:', error);
      checkAllFilesAdded();
    });

  // Backup testScores data
  fetch('http://localhost:8082/api/v1/test_scores', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScores) => {
      const testScoresCSV = convertToCSV(testScores, ['id', 'studentId', 'trainingId', 'score']);
      zip.file('testScores.csv', testScoresCSV);
      checkAllFilesAdded();
    })
    .catch((error) => {
      console.error('Error backing up testScores:', error);
      checkAllFilesAdded();
    });

  // Backup trainings data
  fetch('http://localhost:8082/api/v1/trainings', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((trainings) => {
      const trainingsCSV = convertToCSV(trainings, ['id', 'trainingName']);
      zip.file('trainings.csv', trainingsCSV);
      checkAllFilesAdded();
    })
    .catch((error) => {
      console.error('Error backing up trainings:', error);
      checkAllFilesAdded();
    });

  // Helper function to convert data to CSV format
  const convertToCSV = (data, fields) => {
    const header = fields.join(',') + '\n';
    const rows = data.map(item => fields.map(field => JSON.stringify(item[field])).join(',')).join('\n');
    return header + rows;
  };

  // Helper function to check if all files are added to the zip before downloading
  let numFilesAdded = 0;
  const totalFiles = 3;

  const checkAllFilesAdded = () => {
    numFilesAdded++;
    if (numFilesAdded === totalFiles) {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'database_backup.zip');
      });
    }
  };
};


exportBtn.addEventListener('click', exportDatabase);


// Searches for a student based on first and/or last name
const searchStudent = () => {
  const searchText = searchBox.value.toLowerCase().trim();

  if (searchText === '') {
    loadTable();
    return;
  }

  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    fetch('http://localhost:8082/api/v1/students', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((students) => {
        const filteredStudents = students.filter((student) => {
          const fullName = `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`;
          const reversedFullName = `${student.lastName.toLowerCase()} ${student.firstName.toLowerCase()}`;
          return fullName.includes(searchText) || reversedFullName.includes(searchText);
        });

        if (JSON.stringify(filteredStudents) === JSON.stringify(previousStudents)) {
          return;
        }

        previousStudents = filteredStudents.slice();

        renderStudents(filteredStudents);
      })
      .catch((error) => {
        console.error('Error searching students:', error);
      });
  }, 250);
};


searchBox.addEventListener( 'keyup', () => searchStudent() );
searchBtn.addEventListener( 'click', () => searchStudent() );


addStudentForm.addEventListener( 'submit', async (event) => {

    event.preventDefault();


    if ( addTraining.value > 0 ) {

        tableActive = false;

    const studentToAdd = {
 
        "id": Date.now(),
        "firstName": addFirstName.value,
        "lastName": addLastName.value,
        "dateOfBirth": addDateOfBirth.value,
        "emailAddress": addEmailAddress.value,
        "phoneNumber": addPhoneNumber.value
    }   


    await fetch("http://localhost:8082/api/v1/students", {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
        })
        .then(res => res.json())
        .then(rows => 
            {        

            if ( Object.entries(rows).length == 0 ){

                answer = fetch("http://localhost:8082/api/v1/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( studentToAdd ) } )
                    .then(res => res.json())
                    .then(newStudentEntry => parseInt( newStudentEntry.id ) )

                    return answer;
                                    
            }
            else {

                for (let row of rows) {
    
                    if (row.emailAddress == addEmailAddress.value || row.phoneNumber == addPhoneNumber.value) {

                        fetch(`http://localhost:8082/api/v1/students/${row.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify( studentToAdd ) })

                        fetch("http://localhost:8082/api/v1/test_scores", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
    
                            {
                                "studentId": row.id,
                                "trainingId": addTraining.value,
                                "score": addScore.value
                            }
    
                        ) } )
    
                        tableActive = true;
    
                        break;
                        
                    }
                    else if ( row.id == rows[Object.entries(rows).length - 1].id){   
    
                        answer = fetch("http://localhost:8082/api/v1/students", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify( studentToAdd ) } )
                        .then(res => res.json())
                        .then(newStudentEntry => parseInt( newStudentEntry.id ) )
    
                        return answer;
    
    
        }}
            }
            })
    .then(answer => {

        if (answer) {

            fetch("http://localhost:8082/api/v1/test_scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
            
                    {
                        "studentId": answer,
                        "trainingId": addTraining.value,
                        "score": addScore.value
                    }
            
                ) } )

            tableActive = true;
            
        }
    } )

    const listen = setInterval(() => {

        if (tableActive) {

            loadTable();

            clearInterval(listen)
            
        }
	
        }, 100);
      

    addStudentModal.hide();

    addStudentForm.reset(); 
        
    }

});



addStudentCancelBtn.addEventListener( 'click', () => {
    
    addStudentModal.hide();

    addStudentForm.reset();
    
});


editStudentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const studentId = editStudentForm.getAttribute('data-id');

  const studentUpdateData = {
    firstName: editFirstName.value,
    lastName: editLastName.value,
    dateOfBirth: editDateOfBirth.value,
    emailAddress: editEmailAddress.value,
    phoneNumber: editPhoneNumber.value,
  };

  // Updates student data
  fetch(`http://localhost:8082/api/v1/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentUpdateData),
  })
  .then((res) => {
    if (res.status === 200) {
      console.log(`Student ${editFirstName.value} ${editLastName.value} successfully updated.`);
      
      const testScoreId = parseInt(editScore.getAttribute('data-id'));

      // Updates test score data
      fetch(`http://localhost:8082/api/v1/test_scores/${testScoreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          
          {
            "studentId": studentId,
            "trainingId": editTraining.value,
            "score": parseInt(editScore.value)
          }

        ),
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(`Test score for student ${editFirstName.value} ${editLastName.value} successfully updated.`);
          editStudentModal.hide();
          editStudentForm.reset();
          loadTable();
        } else {
          console.error(`Error updating test score for student: ${editFirstName.value} ${editLastName.value}.`);
        }
      })
      .catch((error) => {
        console.error(`Error updating test score for student: ${editFirstName.value} ${editLastName.value}.`, error);
      });
    } else {
      console.error(`Error updating student ${editFirstName.value} ${editLastName.value}.`);
    }
  })
  .catch((error) => {
    console.error(`Error updating student ${editFirstName.value} ${editLastName.value}.`, error);
  });
});


searchBox.value = '';


addNewStudentBtn.addEventListener('click', () => {

  addStudentsLock = false;
  lockFields(addStudentsLock);

  addDateOfBirth.classList.remove('text-normal');
  addDateOfBirth.classList.add('text-muted');

  fillTrainings(addTraining,false);

  addStudentForm.reset();
});


const getTestScore = (id, callback) => {
  fetch(`http://localhost:8082/api/v1/test_scores/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScore) => {
      callback(testScore); // Passes the test score to the callback function
    })
    .catch((error) => {
      console.error(`Error finding test score with id: ${id}: `, error);
      callback(null); // Passes null to the callback function indicating an error
    });
};


// Locks/Unlocks editing of student's data
const lockFields = (lockStatus) => {

  addFirstName.disabled = lockStatus;
  addLastName.disabled = lockStatus;
  addDateOfBirth.disabled = lockStatus;
  addEmailAddress.disabled = lockStatus;
  addPhoneNumber.disabled = lockStatus;
}


// Fills the addStudentForm with student details
const fillAddModal = (studentId) => {
  fetch(`http://localhost:8082/api/v1/students/${studentId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((student) => {
      if (student) {
        addDateOfBirth.classList.remove('text-muted');
        addDateOfBirth.classList.add('text-normal');

        addStudentForm.setAttribute('data-id', student.id);

        addFirstName.value = student.firstName;
        addLastName.value = student.lastName;
        addDateOfBirth.value = student.dateOfBirth;
        addEmailAddress.value = student.emailAddress;
        addPhoneNumber.value = student.phoneNumber;

        fillTrainings(addTraining, false);

        addStudentsLock = true;

        lockFields(addStudentsLock);
      } else {
        console.error('Error fetching student details.');
      }
    })
    .catch((error) => {
      console.error('Error fetching student details:', error);
    });
};


// Fills the editStudentForm with student and test score data
const fillEditModal = (testScoreId) => {
  fillTrainings(editTraining, false);

  // Fetch the test score details from the server
  fetch(`http://localhost:8082/api/v1/test_scores/${testScoreId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScore) => {
      if (testScore) {
        // Fetch the student details from the server based on studentId
        fetch(`http://localhost:8082/api/v1/students/${testScore.studentId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })
          .then((res) => res.json())
          .then((student) => {
            if (student) {
              // Populates the editStudentForm with the retrieved data
              editStudentForm.setAttribute('data-id', student.id);
              editScore.setAttribute('data-id', testScore.id);

              editFirstName.value = student.firstName;
              editLastName.value = student.lastName;
              editDateOfBirth.value = student.dateOfBirth;
              editEmailAddress.value = student.emailAddress;
              editPhoneNumber.value = student.phoneNumber;
              editTraining.value = testScore.trainingId;
              editScore.value = testScore.score;
            } else {
              console.error(`Error fetching student details.`);
            }
          })
          .catch((error) => {
            console.error('Error fetching student details:', error);
          });
      } else {
        console.error(`Test score with id: ${testScoreId} not found.`);
      }
    })
    .catch((error) => {
      console.error('Error fetching test score:', error);
    });
};


// Deletes the test score (and possibly the student) from the database
const deleteEntry = (testScore) => {
  const testScoreId = testScore.id;
  const studentId = testScore.studentId;

  // Gets the current scroll position
  const scrollPosition = window.scrollY;

  // First, deletes the test score
  fetch(`http://localhost:8082/api/v1/test_scores/${testScoreId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => {
      if (res.status === 200) {
        console.log(`Test score with id: ${testScoreId} successfully deleted.`);
        // If the test score was deleted successfully, checks if the student needs to be deleted
        checkAndDeleteStudent(studentId, scrollPosition); // Passes the scroll position to the next function call
      } else {
        console.error(`Error deleting test score with id: ${testScoreId}`);
      }
    })
    .catch((error) => {
      console.error(`Error deleting test score with id: ${testScoreId}`, error);
    });
};

const checkAndDeleteStudent = (studentId, scrollPosition) => {
  // Fetch all test scores from the server
  fetch(`http://localhost:8082/api/v1/test_scores`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScores) => {
      // Checks if there are any test scores associated with the studentId
      const hasTestScores = testScores.some((testScore) => testScore.studentId === studentId);

      // If there are no test scores associated with the studentId, deletes the student
      if (!hasTestScores) {
        fetch(`http://localhost:8082/api/v1/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        })
          .then((res) => {
            if (res.status === 200) {
              console.log(`Student successfully deleted.`);
            } else {
              console.error(`Error deleting student.`);
            }
          })
          .catch((error) => {
            console.error(`Error deleting student:`, error);
          });
      }
    })
    .catch((error) => {
      console.error(`Error checking if student needs to be deleted:`, error);
    });

  setTimeout(() => {
    loadTable();
  }, 200);

  setTimeout(() => {
    // loadTable();
    window.scrollTo(0, scrollPosition);
  }, 250);
};


const formatRow = (row) => {

    row.style.display = 'grid';
    row.style.gridTemplateColumns = '8% 10% 10% 10% 25% 10% 10% 5% 12%';
    row.style.width = '100%';
    row.style.borderCollapse = 'collapse'
}


const getTrainings = () => {
  return fetch('http://localhost:8082/api/v1/trainings', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching training data:', error);
      return [];
    });
};


const fillTrainings = (picklist, status, message) => {
  // Clears existing options
  picklist.innerHTML = '';

  // Creates and appends new options based on trainings data
  const defaultOption = document.createElement('option');
  defaultOption.value = '0';
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.textContent = message === '' ? '' : 'Select training';
  picklist.appendChild(defaultOption);

  getTrainings()
    .then((trainings) => {
      trainings.forEach((training) => {
        const option = document.createElement('option');
        option.value = training.id;
        option.disabled = status;
        option.textContent = training.trainingName;
        picklist.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error fetching training data:', error);
    });
};


const addNewTraining = (trainingName) => {
  const newTraining = {
    id: Date.now(),
    trainingName: trainingName,
  };

  fetch('http://localhost:8082/api/v1/trainings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTraining),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error;
      }
    })
    .then((response) => {
      console.log(`Training added successfully: ${response.trainingName}`);
    })
    .catch((error) => {
      console.error(`Error adding training: ${trainingName}`, error);
    });
};



addTrainingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const trainingName = addTrainingName.value;
  
  addNewTraining(trainingName);
  addTrainingModal.hide();
  addTrainingForm.reset();
});


// Fills the list of previous trainings in addTrainingForm
addNewTrainingBtn.addEventListener('click', () => {

  fillTrainings(previousTrainings,true,'');

});


const renderStudents = (students) => {
  
  tableBody.innerHTML = '';

  let studentIndex = 0;

  fetch('http://localhost:8082/api/v1/test_scores', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScores) => {
      getTrainings()
        .then((trainings) => {
          students.forEach((student) => {

            studentIndex++;

            const studentTestScores = testScores.filter((testScore) => testScore.studentId === student.id);

            studentTestScores.forEach((testScore, testScoreIndex) => {
              const training = trainings.find((training) => training.id === testScore.trainingId)?.trainingName || '';

              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${testScoreIndex === 0 ? studentIndex + `<button class="btn btn-success btn-sm btn-add" data-id="${testScore.id}" data-bs-toggle="modal" data-bs-target="#addStudentModal">+</button>` : ''}</td>
                <td>${testScoreIndex === 0 ? student.firstName : ''}</td>
                <td>${testScoreIndex === 0 ? student.lastName : ''}</td>
                <td>${testScoreIndex === 0 ? student.dateOfBirth : ''}</td>
                <td>${testScoreIndex === 0 ? student.emailAddress : ''}</td>
                <td>${testScoreIndex === 0 ? student.phoneNumber : ''}</td>
                <td>${training}</td>
                <td>${testScore.score}</td>
                <td>
                  <button class="btn btn-primary btn-sm btn-edit" data-id="${testScore.id}" data-bs-toggle="modal" data-bs-target="#editStudentModal">Edit</button>
                  <button class="btn btn-danger btn-sm btn-delete" data-id="${testScore.id}">Delete</button>
                </td>
              `;

              tableBody.appendChild(row);
              formatRow(row);

              const editBtn = row.querySelector('.btn-edit');
              const deleteBtn = row.querySelector('.btn-delete');

              editBtn.addEventListener('click', () => {
                const testScoreId = parseInt(editBtn.getAttribute('data-id'));
                fillEditModal(testScoreId);
              });

              deleteBtn.addEventListener('click', () => {
                const testScoreId = parseInt(deleteBtn.getAttribute('data-id'));

                getTestScore(testScoreId, (testScore) => {
                  if (testScore) {
                    deleteEntry(testScore);
                  } else {
                    console.error(`Test score with id: ${testScore.id} not found.`);
                  }
                });
              });

              if (testScoreIndex === 0) {
                const addBtn = row.querySelector('.btn-add');

                addBtn.addEventListener('click', () => {
                  const testScoreId = parseInt(addBtn.getAttribute('data-id'));

                  getTestScore(testScoreId, (testScore) => {
                    if (testScore) {
                      fillAddModal(testScore.studentId);
                    } else {
                      console.error(`Test score with id: ${testScore.id} not found.`);
                    }
                  });
                });
              }
            });
          });
        })
        .catch((error) => {
          console.error('Error fetching training data:', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching test scores:', error);
    });
};


// Sends sample data to the server
const sendSampleData = async () => {
  const apiUrl = 'http://localhost:8082/api/v1';

  try {
    // Sends students data
    for (const student of students) {
      const res = await fetch(`${apiUrl}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      const newStudentEntry = await res.json();
    }

    // Sends trainings data
    for (const training of trainings) {
      const res = await fetch(`${apiUrl}/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(training),
      });
      const newTrainingEntry = await res.json();
    }

    // Sends test scores data
    for (const testScore of testScores) {
      const res = await fetch(`${apiUrl}/test_scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testScore),
      });
      const newTestScoreEntry = await res.json();
    }

    console.log('Sample data successfully added.');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};


const loadTable = async () => {
  try {
    const trainingsResponse = await fetch('http://localhost:8082/api/v1/trainings', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const trainings = await trainingsResponse.json();

    if (trainings.length === 0) {

      await sendSampleData();
    }

    const studentsResponse = await fetch('http://localhost:8082/api/v1/students', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const students = await studentsResponse.json();
    renderStudents(students);
  } catch (error) {
    console.error('Error loading data:', error);
  }
};


// Restores the database by importing a ZIP file
restoreDBInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      await restoreDatabase(file);
      loadTable();
      console.log('Database restored successfully.');
    } catch (error) {
      console.error('Error restoring database:', error);
    }
  }

  // Clears the input value to allow importing the same file again
  event.target.value = '';
});


// Helper function to remove quotation marks from data within CSV tables
const removeQuotationMarks = (csvData) => {
  return csvData.replace(/"(.*?)"/g, '$1');
};


// Helper function to truncate tables
const truncateTables = () => {
  const apiUrl = 'http://localhost:8082/api/v1';


  return fetch(`${apiUrl}/test_scores`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((testScores) => {
      const deleteTestScorePromises = testScores.map((testScore) => {
        return fetch(`${apiUrl}/test_scores/${testScore.id}`, { method: 'DELETE' });
      });

      return Promise.all(deleteTestScorePromises);
    })
    .then(() => {

      return fetch(`${apiUrl}/students`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((students) => {
          const deleteStudentPromises = students.map((student) => {
            return fetch(`${apiUrl}/students/${student.id}`, { method: 'DELETE' });
          });

          return Promise.all(deleteStudentPromises);
        });
    })
    .then(() => {

      return fetch(`${apiUrl}/trainings`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((trainings) => {
          const deleteTrainingPromises = trainings.map((training) => {
            return fetch(`${apiUrl}/trainings/${training.id}`, { method: 'DELETE' });
          });

          return Promise.all(deleteTrainingPromises);
        });
    })
    .catch((error) => {
      console.error('Error truncating tables:', error);
    });
};


// Restores the database by importing a ZIP file
const restoreDatabase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const zipData = event.target.result;

      JSZip.loadAsync(zipData)
        .then((zip) => {
          const fileNames = Object.keys(zip.files);

          // Truncate tables before restoring data
          truncateTables()
            .then(() => {
              // Creates an array of promises for parsing and restoring each CSV file
              const restorePromises = fileNames
                .filter((fileName) => fileName.endsWith('.csv'))
                .map((fileName) => {
                  return zip.file(fileName).async('text').then((content) => {
                    const tableName = fileName.split('.csv')[0];
                    const data = parseCSV(removeQuotationMarks(content));
                    return restoreTable(tableName, data);
                  });
                });

              // Waits for all promises to be resolved
              return Promise.all(restorePromises);
            })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsArrayBuffer(file);
  });
};


// Parses CSV data into an array of objects
const parseCSV = (csvData) => {
  const rows = csvData.trim().split('\n');
  const headers = rows.shift().split(',');

  return rows.map((row) => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
};


// Restores the data in a table
const restoreTable = (tableName, data) => {
  return new Promise((resolve, reject) => {
    let endpoint = '';
    if (tableName === 'students') {
      endpoint = 'http://localhost:8082/api/v1/students';
    } else if (tableName === 'testScores') {
      endpoint = 'http://localhost:8082/api/v1/test_scores';
    } else if (tableName === 'trainings') {
      endpoint = 'http://localhost:8082/api/v1/trainings';
    }

    const sendRow = (index) => {

      if (index >= data.length) {
        resolve();
        return;
      }

      const rowData = data[index];
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rowData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to restore data from ' + tableName);
          }
          return res.json();
        })
        .then(() => {
          sendRow(index + 1);
        })
        .catch((error) => {
          reject(error);
        });
    };

    sendRow(0);

  });
};


loadTable();