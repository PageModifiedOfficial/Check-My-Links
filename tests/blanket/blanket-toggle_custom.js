// To avoid inline scripts which are prohibited within Chrome Extensions
$(document).on('click', ".blanket.bl-success a" , function() {
     $(this).closest(".blanket.bl-success").children(".bl-source").toggle();
});
