$(document).ready(function() {

    // date picker
    $(function() {
        $('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd'
        });
    });

    // getting first notes displayed
    var notesUrl = 'http://useo-notes.herokuapp.com';
    var table = $('table.my-notes');

    function insertContent(response) {
        $.each(response.notes, function(i, note) {
            var trNew = $('<tr>', {
                id: note.id,
                class: 'table-row row'
            });
            var checkbox = $('<form><input type="checkbox" name="checkbox" value="checkbox"></form>');
            var tdCheckbox = $('<td class="table-cell col-1">').append(checkbox);
            var tdContent = $('<td class="table-cell col-5">').text(note.content);
            var tdDeadline = $('<td class="table-cell col-2">').text(note.deadline);

            // when deadline is null
            if (note.deadline === null) {
                tdDeadline.text('-');
            };

            var completeButton = $('<i class="fa fa-check fa-lg" aria-hidden="true"></i>');
            var tdCompleteButton = $('<td class="table-cell col-1">').append(completeButton);
            var removeButton = $('<i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>');
            var tdRemoveButton = $('<td class="table-cell col-1">').append(removeButton);

            trNew.append(tdCheckbox);
            trNew.append(tdContent);
            trNew.append(tdDeadline);
            trNew.append(tdCompleteButton);
            trNew.append(tdRemoveButton);
            table.append(trNew);

            // when task complete
            if (note.completed === true) {
                completeButton.addClass('tick-click-change');
                tdCompleteButton.closest('tr').children('.col-5').addClass('text-click-change');
            };
        });
    };

    function loadNotes() {
        $.ajax ({
            url: notesUrl + '/notes',
        }).done(function(response) {
            insertContent(response)
        }).fail(function(error) {
            console.log(error)
        })
    }
    loadNotes();

    // remove note
    $(document).on('click', '.fa-trash-o', removeNote)

    function removeNote() {
        var currentRow = $(this).closest('tr');
        var currentRowId = currentRow.attr('id');
        currentRow.remove();

        $.ajax ({
            url: notesUrl + '/notes/' + currentRowId,
            type: 'delete'
        }).done(function(response) {
            console.log(response);
        }).fail(function(error) {
            console.log(error)
        });
    };

    // add note
    var addButton = $('.button-add');

    addButton.on('click', function(event) {
        event.preventDefault();
        var addTextVal = $('.add-text').val();
        var datepickerVal = $('.datepicker').val();
        var checkbox = $('<form><input type="checkbox" name="checkbox" value="checkbox"></form>');
        var tdCheckbox = $('<td class="table-cell col-1">').append(checkbox);
        var completeButton = $('<i class="fa fa-check fa-lg" aria-hidden="true"></i>');
        var tdCompleteButton = $('<td class="table-cell col-1">').append(completeButton);
        var removeButton = $('<i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>');
        var tdRemoveButton = $('<td class="table-cell col-1">').append(removeButton);
        var trNew = $('<tr class="table-row row">');

        // when text input is empty
        if (addTextVal == '') {
            alert('Please add some text');
            return;
        } else {
            trNew.append(tdCheckbox);
            trNew.append($('<td class="table-cell col-5">').text(addTextVal));
            trNew.append($('<td class="table-cell col-2">').text(datepickerVal));
            trNew.append(tdCompleteButton);
            trNew.append(tdRemoveButton);
            table.append(trNew);
        };

        var notesJson = {
            note: {
                content: addTextVal,
                completed: 'false',
                deadline: datepickerVal
            }
        };

        $.ajax ({
            url: notesUrl + '/notes',
            type: 'post',
            data: notesJson,
            dataType: 'json'
        }).done(function(response) {
            console.log(response);
        }).fail(function(error) {
            console.log(error)
        });
    });

    // mark complete
    $(document).on('click', '.fa-check', function(event) {

        var currentRow = $(this).closest('tr');
        var currentRowId = currentRow.attr('id');

        if ($(event.target).hasClass('tick-click-change')) {
            $.ajax ({
                url: notesUrl + '/notes/' + currentRowId + '/uncompleted',
                type: 'put'
            }).done(function(response) {
                console.log(response);
            }).fail(function(error) {
                console.log(error)
            });
        } else {
            $.ajax ({
                url: notesUrl + '/notes/' + currentRowId + '/completed',
                type: 'put'
            }).done(function(response) {
                console.log(response);
            }).fail(function(error) {
                console.log(error)
            });
        };
        $(event.target).toggleClass('tick-click-change');
        $(event.target).closest('tr').children('.col-5').toggleClass('text-click-change');
    });
});
