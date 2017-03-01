console.log('sourced!');
$(document).ready(function(){
  console.log('jquery was correctly sourced!');
  getBookData();
  function getBookData() {
    $.ajax({
      type: 'GET',
      url: '/books',
      success: function(response) {
        console.log('response', response); // response is an array of book objects
        $('#bookShelf').empty(); // clears the books in the #bookShelf
        for (var i = 0; i < response.length; i++) {
          var currentBook = response[i]; // loops through all of the books
          var $newBook = $('<tr>'); // creating a new row for each book -- object
          $newBook.data('id', currentBook.id); // adding the database id to our row
          // $newBook.append('<td>' + currentBook.title + '</td>');
          // $newBook.append('<td>' + currentBook.author + '</td>');
          // $newBook.append('<td>' + currentBook.edition + '</td>');
          // $newBook.append('<td>' + currentBook.publisher + '</td>');
          $newBook.append('<td><input value="' + currentBook.title + '" class="bookTitle"></td>');
          $newBook.append('<td><input value="' + currentBook.author + '" class="bookAuthor"></td>');
          $newBook.append('<td><input value="' + currentBook.edition + '" class="bookEdition"></td>');
          $newBook.append('<td><input value="' + currentBook.publisher + '" class="bookPublisher"></td>');

          $newBook.append('<td><button class="deleteButton">Delete</button></td>');// add ID to the row and not the button because we're adding an edit button later and the ID will need to be used by the edit button
          $newBook.append('<td><button class="saveButton">Save</button></td>');
          $('#bookShelf').prepend($newBook);
        }
      }
    });
  }

  $('#newBookForm').on('submit', function(event){
    event.preventDefault();
    var newBookObject = {};
    var formFields = $(this).serializeArray();
    formFields.forEach(function (field) {
      newBookObject[field.name] = field.value; // builds newBookObject from form fields
    });

    $.ajax({
      type: 'POST',
      url: '/books/new',
      data: newBookObject,
      success: function(response){
        console.log(response);
        getBookData();
        $('#newBookForm > input').val('');
      }
    });
  });

  $('#bookShelf').on('click', '.deleteButton', function() {
    var idOfBookToDelete = $(this).parent().parent().data().id;
    console.log('The id to delete is', idOfBookToDelete);
    $.ajax({
      type: 'DELETE', // new woo!
      // for bnw, number 44 -> /books/delete/48 -- optional parameter \/
      url: '/books/delete/' + idOfBookToDelete,
      success: function(response) {
        console.log(response);
        getBookData();
      },
      error: function(response) {
        console.log(response);
      }
    })
  }); // end on delete button click listener

  $('#bookShelf').on('click', '.saveButton', function() {
    var idOfBookToSave = $(this).parent().parent().data().id;
    var titleOfBookToSave = $(this).parent().parent().find('.bookTitle').val();
    var authorOfBookToSave = $(this).parent().parent().find('.bookAuthor').val();
    var editionOfBookToSave = $(this).parent().parent().find('.bookEdition').val();
    var publisherOfBookToSave = $(this).parent().parent().find('.bookPublisher').val();

    var bookObjectToSave = {
      title: titleOfBookToSave,
      author: authorOfBookToSave,
      edition: editionOfBookToSave,
      publisher: publisherOfBookToSave
    }
    console.log('The id to save is: ', idOfBookToSave);
    $.ajax({
      type: 'PUT',
      url: '/books/save/' + idOfBookToSave,
      data: bookObjectToSave,
      success: function(response) {
        console.log(response);
      },
      error: function(response) {
        console.log(response);
      }
    }); // end ajax put
  }); // end on save button click listener
}); // end doc ready
