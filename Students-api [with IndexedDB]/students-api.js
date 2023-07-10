const tableBody = document.querySelector('tbody');

const addFirstName = document.getElementById('addFirstName');
const addLastName = document.getElementById('addLastName');
const addDateOfBirth = document.getElementById('addDateOfBirth');
const addEmailAddress = document.getElementById('addEmailAddress');
const addPhoneNumber = document.getElementById('addPhoneNumber');
const addTraining = document.getElementById('addTraining');
const addScore = document.getElementById('addScore');

const editFirstName = document.getElementById('editFirstName');
const editLastName = document.getElementById('editLastName');
const editDateOfBirth = document.getElementById('editDateOfBirth');
const editEmailAddress = document.getElementById('editEmailAddress');
const editPhoneNumber = document.getElementById('editPhoneNumber');
const editTraining = document.getElementById('editTraining');
const editScore = document.getElementById('editScore');

const addNewTrainingBtn = document.getElementById('addNewTrainingBtn');
const addTrainingName = document.getElementById('addTrainingName');
const previousTrainings = document.getElementById('previousTrainings');

const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('searchBtn');

const addNewStudentBtn = document.getElementById('addNewStudentBtn');

const addStudentForm = document.getElementById('addStudentForm');
const addTrainingForm = document.getElementById('addTrainingForm');
const editStudentForm = document.getElementById('editStudentForm');

const addStudentClose = document.getElementById('addStudentClose');
const addStudentReset = document.getElementById('addStudentReset');
const addStudentCancel = document.getElementById('addStudentCancel');

let addStudentsLock;

const exportBtn = document.getElementById('exportBtn');
const restoreDBInput = document.getElementById('restoreDBInput');

const addStudentModal = new bootstrap.Modal(document.getElementById('addStudentModal'), {
  keyboard: false
})

const addTrainingModal = new bootstrap.Modal(document.getElementById('addTrainingModal'), {
  keyboard: false
})

const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'), {
  keyboard: false
})

let db;


// Exports the database as a ZIP file
const exportDatabase = () => {
  const zip = new JSZip();

  // Backup students object store
  const studentsTransaction = db.transaction(['students'], 'readonly');
  const studentsObjectStore = studentsTransaction.objectStore('students');
  const studentsRequest = studentsObjectStore.getAll();

  studentsRequest.onsuccess = (event) => {
    const students = event.target.result;
    const studentsCSV = convertToCSV(students, ['id', 'firstName', 'lastName', 'dateOfBirth', 'emailAddress', 'phoneNumber']);
    zip.file('students.csv', studentsCSV);
    checkAllFilesAdded();
  };

  studentsRequest.onerror = (event) => {
    console.error('Error backing up students:', event.target.error);
    checkAllFilesAdded();
  };

  // Backup testScores object store
  const testScoresTransaction = db.transaction(['testScores'], 'readonly');
  const testScoresObjectStore = testScoresTransaction.objectStore('testScores');
  const testScoresRequest = testScoresObjectStore.getAll();

  testScoresRequest.onsuccess = (event) => {
    const testScores = event.target.result;
    const testScoresCSV = convertToCSV(testScores, ['id', 'studentId', 'trainingId', 'score']);
    zip.file('testScores.csv', testScoresCSV);
    checkAllFilesAdded();
  };

  testScoresRequest.onerror = (event) => {
    console.error('Error backing up testScores:', event.target.error);
    checkAllFilesAdded();
  };

  // Backup trainings object store
  const trainingsTransaction = db.transaction(['trainings'], 'readonly');
  const trainingsObjectStore = trainingsTransaction.objectStore('trainings');
  const trainingsRequest = trainingsObjectStore.getAll();

  trainingsRequest.onsuccess = (event) => {
    const trainings = event.target.result;
    const trainingsCSV = convertToCSV(trainings, ['id', 'trainingName']);
    zip.file('trainings.csv', trainingsCSV);
    checkAllFilesAdded();
  };

  trainingsRequest.onerror = (event) => {
    console.error('Error backing up trainings:', event.target.error);
    checkAllFilesAdded();
  };

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


// Opens the database connection
const openDB = () => {
  const request = indexedDB.open('studentsDatabase', 1);

  let studentsObjectStore;
  let testScoresObjectStore;
  let trainingsObjectStore;

  request.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains('students')) {
      studentsObjectStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
      studentsObjectStore.createIndex('firstName', 'firstName', { unique: false });
      studentsObjectStore.createIndex('lastName', 'lastName', { unique: false });
      studentsObjectStore.createIndex('emailAddress', 'emailAddress', { unique: true });
    }

    if (!db.objectStoreNames.contains('testScores')) {
      testScoresObjectStore = db.createObjectStore('testScores', { keyPath: 'id', autoIncrement: true });
      testScoresObjectStore.createIndex('studentId', 'studentId', { unique: false });
      testScoresObjectStore.createIndex('studentId_trainingId', ['studentId', 'trainingId'], { unique: true });

    }

    if (!db.objectStoreNames.contains('trainings')) {
      trainingsObjectStore = db.createObjectStore('trainings', { keyPath: 'id', autoIncrement: true });
      trainingsObjectStore.createIndex('trainingName', 'trainingName', { unique: true });
    }

    // Loads sample data
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


  students.forEach((student) => {

    const request = studentsObjectStore.add(student);

    request.onerror = () => {
      console.error('Error adding sample data for students.');
    };
  });

  trainings.forEach((training) => {
    
    const request = trainingsObjectStore.add(training);

    request.onerror = () => {
      console.error('Error adding sample data for trainings.');
    };
  });

  testScores.forEach((testScore) => {

    const request = testScoresObjectStore.add(testScore);

    request.onerror = () => {
      console.error('Error adding sample data for test scores.');
    };
  });

  };
  
  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Database opened successfully.');
  };
  
  request.onerror = (event) => {
    console.error('Error opening database:', event.target.error);
  };

  request.onsuccess = () => {
    db = request.result;
    fetchStudents();
  };

};


// Formats table row
const formatRow = (row) => {

  row.style.display = 'grid';
  row.style.gridTemplateColumns = '8% 10% 10% 10% 25% 10% 10% 5% 12%';
  row.style.width = '100%';
  row.style.borderCollapse = 'collapse'
}


// Fetches all students from the students object store
const fetchStudents = () => {
  const transaction = db.transaction('students', 'readonly');
  const objectStore = transaction.objectStore('students');
  const request = objectStore.getAll();

  request.onerror = () => {
    console.error('Error fetching students');
  };

  request.onsuccess = () => {
    loadTable(request.result);
  };
};


// Gets training names from the trainings object store
const getTrainings = (picklist,status,message) => {
  const transaction = db.transaction('trainings', 'readonly');
  const objectStore = transaction.objectStore('trainings');
  const request = objectStore.getAll();

  request.onsuccess = (event) => {
    const trainings = event.target.result;

    // Clears existing options
    picklist.innerHTML = '';

    // Creates and appends new options based on trainings data
    const defaultOption = document.createElement('option');
    defaultOption.value = '0';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.textContent = message == '' ? '' : 'Select training';
    picklist.appendChild(defaultOption);

    trainings.forEach((training) => {
      const option = document.createElement('option');
      option.value = training.id;
      option.disabled = status;
      option.textContent = training.trainingName;
      picklist.appendChild(option);
    });
  };

  request.onerror = (event) => {
    console.error('Error populating addTraining picklist:', event.target.error);
  };
};


// Fills the editStudentForm with student and test score data
const fillEditModal = (testScoreId) => {

  getTrainings(editTraining,false);

  const transaction = db.transaction('testScores', 'readonly');
  const objectStore = transaction.objectStore('testScores');
  const request = objectStore.get(testScoreId);

  request.onerror = () => {
    console.error('Error retrieving testScore details');
  };

  request.onsuccess = () => {

    const testScore = request.result;

    if (testScore) {
      getStudent(testScore.studentId, (student) => {
        if (student) { // Checks if the student is retrieved successfully

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

          console.error(`Student with id: ${testScore.studentId} not found.`);
        }
      });
    }

  };
};


// Renders students in the table
const loadTable = (students) => {
  tableBody.innerHTML = '';

  const testScoresTransaction = db.transaction('testScores', 'readonly');
  const testScoresObjectStore = testScoresTransaction.objectStore('testScores');
  const testScoresIndex = testScoresObjectStore.index('studentId');

  students.forEach((student) => {
    const testScoresRequest = testScoresIndex.getAll(student.id);

    testScoresRequest.onerror = () => {
      console.error('Error fetching students');
    };

    testScoresRequest.onsuccess = (event) => {
      const testScores = event.target.result;

      const trainingTransaction = db.transaction('trainings', 'readonly');
      const trainingObjectStore = trainingTransaction.objectStore('trainings');

      testScores.forEach((testScore, index) => {
        const trainingsRequest = trainingObjectStore.get(testScore.trainingId);

        trainingsRequest.onsuccess = (event) => {
          const training = event.target.result;

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index === 0 ? student.id + `<button class="btn btn-success btn-sm btn-add" data-id="${testScore.id}" data-bs-toggle="modal" data-bs-target="#addStudentModal">+</button>` : ''}</td>
            <td>${index === 0 ? student.firstName : ''}</td>
            <td>${index === 0 ? student.lastName : ''}</td>
            <td>${index === 0 ? student.dateOfBirth : ''}</td>
            <td>${index === 0 ? student.emailAddress : ''}</td>
            <td>${index === 0 ? student.phoneNumber : ''}</td>
            <td>${training.trainingName}</td>
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

          if (index === 0) {
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
        };

        trainingsRequest.onerror = () => {
          console.error('Error fetching training');
        };
      });
    };
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
  const transaction = db.transaction('students', 'readonly');
  const objectStore = transaction.objectStore('students');
  const request = objectStore.get(studentId);

  request.onerror = () => {
    console.error('Error retrieving student details');
  };

  request.onsuccess = () => {
    const student = request.result;
    if (student) {

      addDateOfBirth.classList.remove('text-muted');
      addDateOfBirth.classList.add('text-normal');

      addStudentForm.setAttribute('data-id', student.id);

      addFirstName.value = student.firstName;
      addLastName.value = student.lastName;
      addDateOfBirth.value = student.dateOfBirth;
      addEmailAddress.value = student.emailAddress;
      addPhoneNumber.value = student.phoneNumber;

      getTrainings(addTraining,false);

      addStudentsLock = true;

      lockFields(addStudentsLock);
    }
  };
};


// Adds a new training to the trainings object store
const addNewTraining = (trainingName) => {
  const transaction = db.transaction('trainings', 'readwrite');
  const objectStore = transaction.objectStore('trainings');

  const training = { trainingName };

  const request = objectStore.add(training);

  request.onerror = (event) => {
    console.error('Error adding training:', event.target.error);
  };

  request.onsuccess = (event) => {
    console.log('Training added successfully: ' + training.trainingName);
  };
};


addNewStudentBtn.addEventListener('click', () => {

  addStudentsLock = false;
  lockFields(addStudentsLock);

  addDateOfBirth.classList.remove('text-normal');
  addDateOfBirth.classList.add('text-muted');

  getTrainings(addTraining,false);

  addStudentForm.reset();
});


addTrainingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const trainingName = addTrainingName.value;
  
  addNewTraining(trainingName);
  addTrainingModal.hide();
  addTrainingForm.reset();
});


// Fills the list of previous trainings in addTrainingForm
addNewTrainingBtn.addEventListener('click', () => {

  getTrainings(previousTrainings,true,'');

});


// Searches for a student based on first and/or last name
const searchStudents = () => {
  const searchText = searchBox.value.toLowerCase().trim();

  if (searchText === '') {
    fetchStudents();
    return;
  }

  const transaction = db.transaction('students', 'readonly');
  const objectStore = transaction.objectStore('students');
  const request = objectStore.getAll();

  request.onerror = () => {
    console.error('Error searching students');
  };

  request.onsuccess = () => {
    const students = request.result.filter((student) => {
      const fullName = `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`;
      const reversedFullName = `${student.lastName.toLowerCase()} ${student.firstName.toLowerCase()}`;
      return fullName.includes(searchText) || reversedFullName.includes(searchText);
    });

    loadTable(students);
  };
};


// Deletes the test score (and possibly the student) from the database
const deleteEntry = (testScore) => {
  const transaction = db.transaction(['testScores', 'students'], 'readwrite');
  const testScoresObjectStore = transaction.objectStore('testScores');
  const studentsObjectStore = transaction.objectStore('students');

  const testScoreId = testScore.id;
  const studentId = testScore.studentId;

  const testScoreDeleteRequest = testScoresObjectStore.delete(testScoreId);
  testScoreDeleteRequest.onerror = () => {
    console.error(`Error deleting test score with id: ${testScoreId}`);
  };
  testScoreDeleteRequest.onsuccess = () => {
    console.log(`Test score with id: ${testScoreId} successfully deleted.`);
    checkAndDeleteStudent(testScore);
  };

  const checkAndDeleteStudent = (testScore) => {
    const studentIndex = testScoresObjectStore.index('studentId');
    const range = IDBKeyRange.only(testScore.studentId);
    const countRequest = studentIndex.count(range);

    countRequest.onsuccess = () => {
      const count = countRequest.result;
      if (count === 0) {
        const studentDeleteRequest = studentsObjectStore.delete(studentId);
        studentDeleteRequest.onerror = () => {
          console.error(`Error deleting student with id: ${studentId}`);
        };
        studentDeleteRequest.onsuccess = () => {
          console.log(`Student with id: ${studentId} successfully deleted.`);
        };
      }
    };

    countRequest.onerror = (event) => {
      console.error(`Error counting test scores for student with id: ${studentId}`, event.target.error);
    };

    fetchStudents();
  };
};



// Adds a student record to the students object store
const addStudent = (student) => {
  const transaction = db.transaction('students', 'readwrite');
  const objectStore = transaction.objectStore('students');

  const request = objectStore.add(student);

  request.onsuccess = () => {
    console.log(`Student with id: ${student.id} successfuly added.`);
  };

  request.onerror = (event) => {
    console.error('Error adding student:', event.target.error);
  };
};


// Retrieves a student from the students object store based on the student id value
const getStudent = (id, callback) => {
  const transaction = db.transaction('students', 'readwrite');
  const objectStore = transaction.objectStore('students');
  const request = objectStore.get(id);

  request.onsuccess = (event) => {
    const student = event.target.result;
    callback(student); // Passes the student to the callback function
  };

  request.onerror = (event) => {
    console.error(`Error finding student with id: ${id}: `, event.target.error);
    callback(null); // Passes null to the callback function indicating an error
  };
};


// Retrieves a test score from testScores object store based on testScore's studentId value
const getTestScore = (id, callback) => {
  const transaction = db.transaction('testScores', 'readonly');
  const objectStore = transaction.objectStore('testScores');
  const request = objectStore.get(id);

  request.onsuccess = (event) => {

    const testScore = event.target.result;

    callback(testScore); // Passes the test score to the callback function
  };

  request.onerror = (event) => {
    console.error(`Error finding test with id: ${id}: `, event.target.error);
    callback(null); // Passes null to the callback function indicating an error
  };
};
  

// Formating the text inside the addDateOfBirth field in the addStudentForm
addDateOfBirth.addEventListener('input', () => {

  const value = addDateOfBirth.value;

  if (value === '') {
    addDateOfBirth.classList.remove('text-normal');
    addDateOfBirth.classList.add('text-muted');
  } else {
    addDateOfBirth.classList.remove('text-muted');
    addDateOfBirth.classList.add('text-normal');
  }
});


// Resetting the addStudentForm
[addStudentClose,addStudentReset,addStudentCancel].forEach( button => {

  button.addEventListener('click', () => {

    addDateOfBirth.classList.remove('text-normal');
    addDateOfBirth.classList.add('text-muted');

    getTrainings(addTraining,false); 
  });
});


// Adds a test score to the testScores object store
const addTestScore = (testScore) => {
  const transaction = db.transaction('testScores', 'readwrite');
  const testScoresObjectStore = transaction.objectStore('testScores');

  const request = testScoresObjectStore.add(testScore);

  request.onsuccess = () => {
    console.log(`Test score for student ${student.firstName} ${student.lastName} successfuly added.`);
  };

  request.onerror = (event) => {
    console.error('Error adding test score:', event.target.error);
  };
};


// Event listeners for the search area
searchBox.addEventListener('keyup', searchStudents);
searchBtn.addEventListener('click', searchStudents);


addStudentForm.addEventListener('submit', (event) => {

  event.preventDefault(); // Prevents form submission

  const student = {

    firstName: addFirstName.value,
    lastName: addLastName.value,
    dateOfBirth: addDateOfBirth.value,
    emailAddress: addEmailAddress.value,
    phoneNumber: addPhoneNumber.value
  };

  const testScore = {

    studentId: '',
    trainingId: parseInt(addTraining.value),
    score: parseInt(addScore.value)
  };

  const studentTransaction = db.transaction('students', 'readwrite');
  const studentObjectStore = studentTransaction.objectStore('students');
  
if (addStudentsLock === false) {

  const addStudentRequest = studentObjectStore.add(student);

  addStudentRequest.onsuccess = (event) => {
    const studentId = event.target.result;
    testScore.studentId = studentId;

    const testScoreTransaction = db.transaction('testScores', 'readwrite');
    const testScoreObjectStore = testScoreTransaction.objectStore('testScores');
    const addTestScoreRequest = testScoreObjectStore.add(testScore);

    addTestScoreRequest.onsuccess = () => {
      addStudentModal.hide();
      addStudentForm.reset();
      fetchStudents();
    };

    addTestScoreRequest.onerror = (event) => {
      console.error("Error adding test score:", event.target.error);
    };
  };

  addStudentRequest.onerror = (event) => {
    console.error("Error adding student:", event.target.error);
  };
  
} else {

  testScore.studentId = parseInt(addStudentForm.getAttribute('data-id'));

  const testScoreTransaction = db.transaction('testScores', 'readwrite');
  const testScoreObjectStore = testScoreTransaction.objectStore('testScores');
  const addTestScoreRequest = testScoreObjectStore.add(testScore);

  addTestScoreRequest.onsuccess = () => {
    addStudentModal.hide();
    addStudentForm.reset();
    fetchStudents();
  };

  addTestScoreRequest.onerror = (event) => {
    console.error("Error adding test score:", event.target.error);
  };  
  
  }
});


// Restores the database by importing a ZIP file, extracting its contents, and parsing the CSV files as object stores
restoreDBInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      await restoreDatabase(file);
      fetchStudents();
    } catch (error) {
      console.error('Error restoring database:', error);
    }
  }

    // Clears the input value to allow importing the same file again
    event.target.value = '';
});


const restoreDatabase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const zipData = event.target.result;

      JSZip.loadAsync(zipData)
        .then((zip) => {
          const fileNames = Object.keys(zip.files);

          // Creates an array of promises for parsing and restoring each CSV file
          const restorePromises = fileNames
            .filter((fileName) => fileName.endsWith('.csv'))
            .map((fileName) => {
              return zip.file(fileName).async('text').then((content) => {
                const objectStoreName = fileName.split('.csv')[0];
                const data = parseCSV(content);
                return restoreObjectStore(objectStoreName, data);
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


// Restores the data in an object store
const restoreObjectStore = (objectStoreName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    transaction.onerror = (event) => {
      reject(event.target.error);
    };

    transaction.oncomplete = () => {
      resolve();
    };

    // Clears the existing data in the object store
    objectStore.clear().onsuccess = () => {
      // Adds the restored data to the object store
      data.forEach((record) => {
        const trimmedRecord = {};
        Object.keys(record).forEach((key) => {
          trimmedRecord[key] = record[key].replace(/^"(.*)"$/, '$1');
        });

        if (objectStoreName == 'students' || objectStoreName == 'trainings') {

          trimmedRecord.id = parseInt(trimmedRecord.id);

        } else if (objectStoreName == 'testScores') {

          trimmedRecord.id = parseInt(trimmedRecord.id);
          trimmedRecord.studentId = parseInt(trimmedRecord.studentId);
          trimmedRecord.trainingId = parseInt(trimmedRecord.trainingId);
          trimmedRecord.score = parseInt(trimmedRecord.score);

          
        }

        const request = objectStore.add(trimmedRecord);

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };
  });
};


editStudentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const studentId = parseInt(editStudentForm.getAttribute('data-id'));

  const studentTransaction = db.transaction('students', 'readwrite');
  const studentObjectStore = studentTransaction.objectStore('students');
  const studentRequest = studentObjectStore.get(studentId);

  studentRequest.onsuccess = (event) => {
    const student = studentRequest.result;

    student.firstName = editFirstName.value;
    student.lastName = editLastName.value;
    student.dateOfBirth = editDateOfBirth.value;
    student.emailAddress = editEmailAddress.value;
    student.phoneNumber = editPhoneNumber.value;

    const studentUpdateRequest = studentObjectStore.put(student);

    studentUpdateRequest.onsuccess = () => {

      const testScoreId = parseInt(editScore.getAttribute('data-id'));

      const testScoreTransaction = db.transaction('testScores', 'readwrite');
      const testScoreObjectStore = testScoreTransaction.objectStore('testScores');
      const testScoreRequest = testScoreObjectStore.get(testScoreId);

      testScoreRequest.onsuccess = () => {
        const testScore = testScoreRequest.result;

        if (testScore) {

          testScore.trainingId = parseInt(editTraining.value);
          testScore.score = parseInt(editScore.value);

          const testScoreUpdateRequest = testScoreObjectStore.put(testScore);

          testScoreUpdateRequest.onsuccess = () => {
            editStudentModal.hide();
            editStudentForm.reset();
            fetchStudents();
          };

          testScoreUpdateRequest.onerror = (event) => {
            console.error("Error editing test score:", event.target.error);
          };
        } else {
          console.error(`Test score with studentId: ${studentId} not found.`);
        }
      };

      testScoreRequest.onerror = (event) => {
        console.error(`Error finding test score with studentId: ${studentId}:`, event.target.error);
      };
    };

    studentUpdateRequest.onerror = (event) => {
      console.error("Error editing student:", event.target.error);
    };
  };

  studentRequest.onerror = (event) => {
    console.error(`Error finding student with id: ${studentId}:`, event.target.error);
  };
});


openDB();