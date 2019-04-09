var friends = [];
var friendNum = 1;

$(document).on("click", "#submitCreateStory", function (e) {
  e.preventDefault();

  let friend = $("#createStoryFriend" + friendNum);
  if (!emailExists(friend.val().trim())) {
    friends.push(friend.val());
  }

  var newStory = {
    title: $("#createTitle")
      .val()
      .trim(),
    totalChar: $("#createTotalCharacters")
      .val()
      .trim(),
    totalTurn: $("#createTotalTurns")
      .val()
      .trim(),
    firstParagraph: $("#createFirstParagraph")
      .val()
      .trim(),
    friends: JSON.stringify(friends)
  };


  // Send the POST request.
  $.ajax("/api/createStory", {
    type: "POST",
    data: newStory
  })
    .then(data => {
      // console.log('here');
    })
    .catch({})
})


$(document).on("click", "#addFriend", function (e) {
  e.preventDefault();

  let invalid = $("#createStoryFriendInvalid" + friendNum);
  invalid.attr("class", "invalid-feedback");

  let friend = $("#createStoryFriend" + friendNum);

  if (friend.val().trim() === "") {
    invalid.attr("class", "invalid-feedback d-block");
    invalid.text("Friend's email address cannot be blank");
  } else if (emailExists(friend.val().trim())) {
    invalid.attr("class", "invalid-feedback d-block");
    invalid.text("Email address already used");
  } else {
    friends.push(friend.val());
    friend.prop("readonly", "true");
    $("#addFriend").html("<i class='fas fa-trash-alt'></i>");
    $("#addFriend").attr("class", "btn btn-delete float-right deleteFriend");
    $("#addFriend").data('friendNum', friendNum);
    $("#addFriend").data('friend', friend.val());
    $("#addFriend").attr("id", "");


    friendNum++;
    let newFriend = `<div class="form-group form-inline">
            <label for="storyFriend${friendNum}" class="mr-1">${friendNum}:</label>
            <input type="email" id="createStoryFriend${friendNum}" class="form-control w-75" aria-describedby="Story Friend ${friendNum} eMail Address">
            <div class="invalid-feedback" id="createStoryFriendInvalid${friendNum}">             
            </div>
            <button id="addFriend" class="btn btn-secondary float-right">Add Friend</button>
          </div>`;

    $("#allFriends").append(newFriend);
    $(`#createStoryFriend${friendNum}`).focus();
  }
});

function emailExists(inputEmail) {
  let isDupe = false;

  if (inputEmail === $("#createTitle").data("email")) {  //compare input to user's email address
    isDupe = true;
  } else {
    friends.forEach(function (value) {
      if (value === inputEmail) {
        isDupe = true;
      }
    });
  }
  return isDupe;
}

$(document).on("click", ".deleteFriend", function (e) {
  e.preventDefault();

  let friendNum = $(this).data('friendNum');
  $(this)
    .parent()
    .remove();

  let friendsTemp = [];
  friends.forEach(function (value) {
    if (value !== $(this).data("friend")) {
      friendsTemp.push(value);
    }

    friends = friendsTemp;
  })
})


$(document).on("input", "#createTotalCharacters", function () {
  var totalChar = $("#createTotalCharacters")
    .val()
    .trim();
  var validNum = false;


  var invalid = $("#createTotalCharactersInvalid");
  invalid.attr("class", "invalid-feedback");


  if (!isNaN(totalChar)) {
    var charNum = parseFloat(totalChar);
    if (Number.isInteger(charNum)) {
      if (charNum > 0 && charNum < 500) {
        validNum = true;
      }
    }
  }

  if (!validNum) {
    invalid.attr("class", "invalid-feedback d-block");
    invalid.text("Numbers between 1 and 500");
  } else {
    $("#charsLeft").text(
      charNum -
      $("#createFirstParagraph")
        .val()
        .trim().length
    );
  }
});


$(document).on("input", "#createFirstParagraph", function () {
  var totalChar = $("#createTotalCharacters")
    .val()
    .trim();

  $("#charsLeft").text(
    totalChar -
    $("#createFirstParagraph")
      .val()
      .trim().length
  );
});


$(document).on("input", "#createTotalTurns", function () {
  var totalTurn = $("#createTotalTurns")
    .val()
    .trim();
  var validNum = false;

  var invalid = $("#createTotalTurnsInvalid");
  invalid.attr("class", "invalid-feedback");

  if (!isNaN(totalTurn)) {
    var charNum = parseFloat(totalTurn);
    if (Number.isInteger(charNum)) {
      if (charNum > 0 && charNum < 11) {
        validNum = true;
      }
    }
  }

  if (!validNum) {
    invalid.attr("class", "invalid-feedback d-block");
    invalid.text("Numbers between 1 and 10");
  }
});