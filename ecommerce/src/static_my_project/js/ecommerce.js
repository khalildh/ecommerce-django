
$(document).ready(function(){
    // Contact Form Handler
    var contactForm = $('.contact-form');
    var contactFormMethod = contactForm.attr('method');
    var contactFormEndpoint = contactForm.attr('action');

    function displaySubmitting(submitBtn, defaultText, doSubmit){
        
        if (doSubmit){
        submitBtn.addClass('disabled')
        submitBtn.html("<i class='fa fa-spin fa-spinner'></i> Sending..")  
        } else {
        submitBtn.removeClass('disabled')
        submitBtn.html(defaultText)
        }
    }

    contactForm.submit(function(event){
        event.preventDefault();
        var contactFormData = contactForm.serialize();
        var thisForm = $(this);
        var contactFormSubmitBtn = contactForm.find("[type='submit']");
        var contactFormSubmitBtnTxt = contactFormSubmitBtn.text()

        displaySubmitting(contactFormSubmitBtn, "" ,true);
        $.ajax({
        method: contactFormMethod,
        url: contactFormEndpoint,
        data: contactFormData,
        success: function(data){
            console.log(data);
            contactForm[0].reset();
            $.alert({
            title: "Success",
            content: data.message,
            theme: "modern"
            })
            setTimeout(function(){
            displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt , false)
            }, 500)
        },
        error: function(error){
            console.log(error.responseJSON)
            var jsonData = error.responseJSON
            var msg = "";
            $.each(jsonData, function(key, value){
            msg += key + ": " + value[0].message + '<br/>';
            })
            $.alert({
            title: "Error",
            content: msg,
            theme: "modern"
            })
            setTimeout(function(){
            displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt,false)
            }, 500)
        }
        })
    });




    // Auto Search
    var searchForm = $('.search-form');
    var searchInput = searchForm.find("[name='q']");
    var typingTimer;
    var typingInterval = 500;
    var searchBtn = searchForm.find("[type='submit']");
    searchInput.keyup(function(event){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(performSearch, typingInterval)
    })

    searchInput.keydown(function(event){
        clearTimeout(typingTimer);
    })

    function displaySearching(){
        searchBtn.addClass('disabled')
        searchBtn.html("<i class='fa fa-spin fa-spinner'></i> Searching..")
    }

    function performSearch(){
        displaySearching();
        var query = searchInput.val();
        setTimeout(function(){
        window.location.href='/search/?q=' + query                
        }, 1000)
    }


    // Cart + Add Products
    var productForm = $(".form-product-ajax");            

    productForm.submit(function(event) {
        event.preventDefault();
        console.log("Form is not sending");
        var thisForm = $(this);
        var actionEndpoint = thisForm.attr("data-endpoint");
        var httpMethod = thisForm.attr("method");
        var formData = thisForm.serialize();


        $.ajax({
        url: actionEndpoint,
        method: httpMethod,
        data: formData,
        success: function(data){
            console.log("success")
            console.log(data)
            console.log("Added: ", data.added)
            console.log("Removed: ", data.removed)
            var submitSpan = thisForm.find('.submit-span')
            if (data.added) {
            submitSpan.html('In cart<button type="submit" class="btn btn-link">Remove?</button>')
            } else {
            submitSpan.html('<button type="submit" class="btn btn-success">Add to cart</button>')
            }

            var navbarCount = $('.navbar-cart-count')
            navbarCount.text(data.cartItemCount)

            var currentPath = window.location.href
            if (currentPath.indexOf('cart') != -1){
            refreshCart();
            }
            
        },
        error: function(errorData){
            $.alert({
            title: "Oops",
            content: "An error occurred",
            theme: "modern"
            })
            console.log("error")
            console.log(errorData)
        } 
        });


        function refreshCart(){
        console.log("In current cart");
        var cartTable = $('.cart-table');
        var cartBody = cartTable.find('.cart-body');
        var productRows = cartBody.find('.cart-product');
        var currentUrl = window.location.href

        var refreshCartURL = "/api/cart/";
        var refreshCartMethod = "GET";
        var data = {};

        $.ajax({
            url: refreshCartURL,
            method: refreshCartMethod,
            data: 'data',
            success: function(data){

            var hiddenCartItemRemoveForm = $('.cart-item-remove-form');
            if (data.products.length > 0){
                productRows.html(" ");
                
                var c = data.products.length;                      
                $.each(data.products, function(index, value){
                console.log(value);
                var newCartItemRemove = hiddenCartItemRemoveForm.clone()
                newCartItemRemove.css("display", "block");
                newCartItemRemove.find('.cart-item-product-id').val(value.id);
                cartBody.prepend(
                    "<tr>\
                    <th scope=\"row\">" + c + "</th> \
                    <td><a href='" + value.url + "'>" + value.name + "</a>" +
                        newCartItemRemove.html() +
                        "</td> \
                    <td>" + value.price + "</td> \
                    </tr>");

                c--;
                });

                cartBody.find('.cart-subtotal').text(data.subtotal)
                cartBody.find('.cart-total').text(data.total)
            } else {
                window.location.href =  currentUrl
            }
            },
            error: function(errorData){
            $.alert({
                title: "Oops",
                content: "An error occurred",
                theme: "modern"
            })
            console.log("error");
            console.log(errorData)
            }
        })
        }

    });
});