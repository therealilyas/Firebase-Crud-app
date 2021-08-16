const tableEmployees = document.querySelector('.table-employees');

const modalWrapper = document.querySelector('.modal-wrapper');

const addBtn = document.querySelector('.add-btn');
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');


let id;

const renderEmployee = doc => {
    const tr = `

    <tr data-id='${doc.id}'>
        <td>${doc.data().firstName}</td>
        <td>${doc.data().lastName}</td>
        <td>${doc.data().job}</td>
        <td>${doc.data().phone}</td>
        <td>${doc.data().email}</td>
        <td>
            <button class="btn edit-btn">Edit</button>
            <button class="btn delete-btn">Delete</button>
        </td>
    </tr>`
    tableEmployees.insertAdjacentHTML('beforeend', tr);

    const editBtn = document.querySelector(`[data-id='${doc.id}'] .edit-btn`);
    id = doc.id;

    editBtn.addEventListener('click', () => {
        editModal.classList.add('modal-show');

        editModalForm.firstName.value = doc.data().firstName;
        editModalForm.lastName.value = doc.data().lastName;
        editModalForm.job.value = doc.data().job;
        editModalForm.phone.value = doc.data().phone;
        editModalForm.email.value = doc.data().email;

    });

    const deleteBtn = document.querySelector(`[data-id='${doc.id}'] .delete-btn`);

    deleteBtn.addEventListener('click', () => {
        db.collection('employees').doc(`${doc.id}`).delete().then(() => {
            console.log('Document succesfully deleted!');
        }).catch(err => {
            console.log('Error removing document', err);
        });
    });
}

db.collection('employees').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderEmployee(change.doc);
        }
        if (change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}'`)
            let tbody = tr.parentElement;
            tableEmployees.removeChild(tbody);
        }
        if (change.type === 'modified') {
            let tr = document.querySelector(`[data-id='${change.doc.id}'`)
            let tbody = tr.parentElement;
            tableEmployees.removeChild(tbody);
            renderEmployee(change.doc);
        }
    });
});



addBtn.addEventListener('click', () => {
    addModal.classList.add('modal-show');

    addModalForm.firstName.value = '';
    addModalForm.lastName.value = '';
    addModalForm.job.value = '';
    addModalForm.phone.value = '';
    addModalForm.email.value = '';

});
addModalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('employees').add({
        firstName: addModalForm.firstName.value,
        lastName: addModalForm.lastName.value,
        job: addModalForm.job.value,
        phone: addModalForm.phone.value,
        email: addModalForm.email.value
    });
    console.log(addModalForm.firstName.value);
    modalWrapper.classList.remove('modal-show');
});

editModalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('employees').doc(id).update({
        firstName: editModalForm.firstName.value,
        lastName: editModalForm.lastName.value,
        job: editModalForm.job.value,
        phone: editModalForm.phone.value,
        email: editModalForm.email.value
    });
    editModal.classList.remove('modal-show');
});