document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', () => {
      alert('Prodotto aggiunto al carrello!');
    });
  });
