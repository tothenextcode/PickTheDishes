$(() => {

  const orderItems = [];
  let orderItem = {};

  // open popup
  $('.food').on('click', function (event) {
    event.preventDefault();
    $('.add-modal').removeClass('hidden');

    // get food.id that has been clicked
    let elmId = $(this).attr('id');
    showItem(elmId);
  });

  // const changeQunantity = function(num) {
  //   let $input = $(this).parent().find('input');
  //   console.log($(this));
  //   let count = parseInt($input.val())
  //   count = count < 1 ? 1 : count + num;
  //   $input.val(count);
  //   $input.change();
  // }

  // minus button for quantity
  $('.minus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count - 1;
    $input.val(count);
    $input.change();
  });

  // plus button for quantity
  $('.plus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count + 1;
    $input.val(count);
    $input.change();
  });


  //close popup
  $('.close').on('click', function (event) {
    event.preventDefault();
    $('.modal-content').empty();
    const modal = $(this).closest('.modal-background');
    modal.addClass('hidden');
  });



  // add item to the cart
  $('.add').on('click', function() {
    // added food data to make food-in-cart
    const $input = $(this).parent().find('input');
    const quantity = $input.val();
    $input.val(1);
    const $food = $('.add-modal').find('.food-name').text();
    const $price = $('.add-modal').find('.price').text()
    const unitPrice = $price.split(" ")[2];
    const sumPrice = unitPrice * quantity;
    const $id = $('.add-modal').find('.food-id').text();

    // check if food is already exist in the array
    // change the quantity of the object
    // orderItems = [];
    const createItemObj = () => {
      orderItem.id = $id;
      orderItem.food = $food;
      orderItem.quantity = quantity;
      orderItem.price = sumPrice;
      orderItems.push(orderItem);
    };
    let isAdded = false;
    let addedFood;
    for (const item of orderItems) {
      if ($food === item.food) {
        isAdded = true;
        addedFood = item;
      }
    }

    if (isAdded === true) {
      addedFood.quantity = quantity;
      addedFood.price = sumPrice;
    } else {
      createItemObj();
    }

    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);
    // empty object so new item can be made
    orderItem = {};

    const modal = $(this).closest('.modal-background');
    modal.addClass('hidden');
  });

  // change quantity in the cart
  $('.cart-list').on('click','.food-in-cart', function() {
    const $id = $(this).find('.food-id').text();
    showItem($id);
    $('.update-modal').removeClass('hidden');
  })

  // update button will update quantity
  $('.update').on('click', function() {
    const modal = $(this).closest('.modal-background');
    const $input = $(this).parent().find('input');
    const quantity = $input.val();
    $input.val(1);
    const $id = modal.find('.food-id').text();
    const $price = modal.find('.price').text();
    const unitPrice = $price.split(" ")[2];

    for (const item of orderItems) {
      if (item.id === $id) {
        item.quantity = quantity;
        item.price = unitPrice * quantity;
      }
    }

    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);

    modal.addClass('hidden');
  })

  // delete from the cart
  $('.cart-list').on('click', '.delete', function(event) {
    event.stopPropagation();
    const food = $(this).closest('.food-in-cart')
    const $id = food.find('.food-id').text();

    for (const item of orderItems) {
      if (item.id === $id) {
        const index = orderItems.indexOf(item);
        orderItems.splice(index, 1);
      }
    }
    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);
  })

  $('.checkout-button').on('click', function() {

    // if user is not logged, show login first
    const logged = $(this).siblings('.logged').text();
    if (!logged) {
      $('.not-logged').removeClass('hidden');
    }

    // if orderItems exist with logged user
    if (logged) {
      // if orderItems empty, show Cart is empty
      if (orderItems.length === 0) {
        $('.empty').removeClass('hidden');
      } else {
        $('.order-confirm').removeClass('hidden');
        const data = JSON.stringify(orderItems); // don't need in js
        console.log(orderItems);
        $.ajax({
          url: '/orders',
          method: 'POST',
          data: data,
          contentType: 'application/json'
        })
      }
    }

  });

})
