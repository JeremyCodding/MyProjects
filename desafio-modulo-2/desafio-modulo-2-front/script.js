const inputPesquisa = document.querySelector('input');
const movies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const quantidadeDeImagens = 5;
let contador = 0;
let paginaDeFilmes = 0;

const videoHightLight = document.querySelector('.highlight__video')
const highLightTitulo = document.querySelector('.highlight__title');
const highLightNota = document.querySelector('.highlight__rating');
const tagGenero = document.querySelector('.highlight__genres');
const tagLancamento = document.querySelector('.highlight__launch');
const descricaoHighligth = document.querySelector('.highlight__description');
const linkDoFilme = document.querySelector('.highlight__video-link');

const modalFilme = document.querySelector('.modal');
const btnFecharModal = document.querySelector('.modal__close');
const tituloModal = document.querySelector('.modal__title');
const imgModal = document.querySelector('.modal__img');
const descricaoModal = document.querySelector('.modal__description');
const notaGeneroModal = document.querySelector('.modal__genre-average');
const generosModal = document.querySelector('.modal__genres');
const notaModal = document.querySelector('.modal__average')

const botaoTema = document.querySelector('.btn-theme');
const bodyDoSite = document.querySelector('body');
let temaAtual = localStorage.getItem('tema');


bodyDoSite.style.setProperty('--background-color', temaAtual === 'escuro' ? "#111" : '#fff')
bodyDoSite.style.setProperty('--color', temaAtual === 'escuro' ? '#fff' : '#000');
bodyDoSite.style.setProperty('--highlight-background', temaAtual === 'escuro' ? '#333' : '#fff');
bodyDoSite.style.setProperty('--highlight-description', temaAtual === 'escuro' ? '#fff' : '#000');
bodyDoSite.style.setProperty('--highlight-color', temaAtual === 'escuro' ? '#fff' : 'rgba(0, 0, 0, 0.7)');

if(temaAtual === 'claro' || temaAtual === null){
    localStorage.setItem('tema', 'claro');
    botaoTema.src = './assets/light-mode.svg';
    btnPrev.src = './assets/seta-esquerda-preta.svg';
    btnNext.src = './assets/seta-direita-preta.svg';
}else {
    botaoTema.src = './assets/dark-mode.svg';
    btnPrev.src = './assets/seta-esquerda-branca.svg';
    btnNext.src = './assets/seta-direita-branca.svg';
}

botaoTema.addEventListener('click', event => {

    if (localStorage.getItem('tema') === 'claro'){
        console.log('claro');
        localStorage.setItem('tema', 'escuro');

        botaoTema.src = './assets/dark-mode.svg';
        bodyDoSite.style.setProperty('--background-color', '#111');
        bodyDoSite.style.setProperty('--color', '#fff');

        bodyDoSite.style.setProperty('--highlight-background', '#333');
        bodyDoSite.style.setProperty('--highlight-description', '#fff');
        bodyDoSite.style.setProperty('--highlight-color', '#fff');
        btnPrev.src = './assets/seta-esquerda-branca.svg';
        btnNext.src = './assets/seta-direita-branca.svg';
    }else {
        console.log('escuro');
        localStorage.setItem('tema', 'claro');

        botaoTema.src = './assets/light-mode.svg';
        bodyDoSite.style.setProperty('--background-color', '#fff');
        bodyDoSite.style.setProperty('--color', '#000');

        bodyDoSite.style.setProperty('--highlight-background', '#fff');
        bodyDoSite.style.setProperty('--highlight-description', '#000');
        bodyDoSite.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)');
        btnPrev.src = './assets/seta-esquerda-preta.svg';
        btnNext.src = './assets/seta-direita-preta.svg';
    }

})

inputPesquisa.addEventListener('keypress', (event) => {
    contador = 0;
    if (event.key !== "Enter"){
        return
    }else if(inputPesquisa.value ==='') {
        location.reload()
    }else {
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputPesquisa.value}`).then(resposta => {
            const promiseBody = resposta.json();
            promiseBody.then(body => {
                const arrayDeFilmes = []
                for (let filmesPesquisa of body.results){
                    if (filmesPesquisa.title.includes(inputPesquisa.value)){
                        arrayDeFilmes.push(filmesPesquisa);
                    }
                }
                console.log(arrayDeFilmes)
                while(movies.firstChild){
                    movies.removeChild(movies.firstChild);
                }
        
                for (let filme of arrayDeFilmes){
                    if (contador < quantidadeDeImagens){
                        const divCartaz = document.createElement('div');
                        const divSubCartaz = document.createElement('div');
                        const nomeFilme = document.createElement('span');
                        const movieRating = document.createElement('span');
                        const imagemEstrela = document.createElement('img');
                        const ratingNumero = filme.vote_average
                        imagemEstrela.src = './assets/estrela.svg'
            
                        divCartaz.addEventListener('click', (event) => {
                            while(generosModal.firstChild){
                                generosModal.removeChild(generosModal.firstChild)
                            }
                            modalFilme.classList.remove('hidden');
                            const idDofilme = filme.id;
                            btnFecharModal.addEventListener('click', (event) =>{
                                modalFilme.classList.add('hidden')
                            })
                            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                                const promiseBody = resposta.json();
                                const spanDeSpan = document.createElement('span')
                                promiseBody.then(body => {
                                    body.genres.forEach(genero => {
                                        const spanGenero = document.createElement('span');
                                        spanGenero.classList.add('modal__genre')
                                        spanGenero.textContent = genero.name
                                        spanDeSpan.append(spanGenero);
                                        spanDeSpan.append(' ')
                                    })
            
                                    tituloModal.textContent = body.title;
                                    imgModal.src = body.backdrop_path;
                                    descricaoModal.textContent = body.overview;
                                    notaModal.textContent = body.vote_average;
                                    generosModal.append(spanDeSpan);
                                    
                                })
                            })
                            
                        })
                        
                        divSubCartaz.classList.add('movie__info');
                        divCartaz.classList.add('movie');
                        nomeFilme.classList.add('movie__title')
                        movieRating.classList.add('movie__rating')
                        movieRating.append(imagemEstrela);
                        movieRating.append(ratingNumero)
                        nomeFilme.textContent = filme.original_title;
            
                        divSubCartaz.append(nomeFilme);
                        divSubCartaz.append(movieRating);
            
                        
                        divCartaz.style.backgroundImage = `url(${filme.poster_path})`
            
                        divCartaz.append(divSubCartaz)
                        movies.append(divCartaz)
            
                        contador++
                    }
                }


                btnNext.addEventListener('click', (event) => {
                    paginaDeFilmes += 5;
                    while(movies.firstChild){
                        movies.removeChild(movies.firstChild);
                    }
                    
                    if (paginaDeFilmes < 20) {
                        for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                            const filmeAtual = body.results[i];
                            const divCartaz = document.createElement('div');
                            const divSubCartaz = document.createElement('div');
                            const nomeFilme = document.createElement('span');
                            const movieRating = document.createElement('span');
                            const imagemEstrela = document.createElement('img');
                            const ratingNumero = filmeAtual.vote_average
                            imagemEstrela.src = './assets/estrela.svg'
        
                            divCartaz.addEventListener('click', (event) => {
                                while(generosModal.firstChild){
                                    generosModal.removeChild(generosModal.firstChild)
                                }
                                modalFilme.classList.remove('hidden');
                                const idDofilme = filmeAtual.id;
                                btnFecharModal.addEventListener('click', (event) =>{
                                    modalFilme.classList.add('hidden')
                                })
                                fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                                    const promiseBody = resposta.json();
                                    const spanDeSpan = document.createElement('span')
                                    promiseBody.then(body => {
                                        body.genres.forEach(genero => {
                                            const spanGenero = document.createElement('span');
                                            spanGenero.classList.add('modal__genre')
                                            spanGenero.textContent = genero.name
                                            spanDeSpan.append(spanGenero);
                                            spanDeSpan.append(' ')
                                        })
        
                                        tituloModal.textContent = body.title;
                                        imgModal.src = body.backdrop_path;
                                        descricaoModal.textContent = body.overview;
                                        notaModal.textContent = body.vote_average;
                                        generosModal.append(spanDeSpan);
                                        
                                    })
                                })
                                
                            })
                        
                            divSubCartaz.classList.add('movie__info');
                            divCartaz.classList.add('movie');
                            nomeFilme.classList.add('movie__title')
                            movieRating.classList.add('movie__rating')
                            movieRating.append(imagemEstrela);
                            movieRating.append(ratingNumero)
                            nomeFilme.textContent = filmeAtual.original_title
        
                            divSubCartaz.append(nomeFilme);
                            divSubCartaz.append(movieRating);
        
                            
                            divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                            divCartaz.append(divSubCartaz)
                            movies.append(divCartaz)
                        }
                    }else {
                        paginaDeFilmes = 0;
                        for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                            const filmeAtual = body.results[i];
                            const divCartaz = document.createElement('div');
                            const divSubCartaz = document.createElement('div');
                            const nomeFilme = document.createElement('span');
                            const movieRating = document.createElement('span');
                            const imagemEstrela = document.createElement('img');
                            const ratingNumero = filmeAtual.vote_average
                            imagemEstrela.src = './assets/estrela.svg'
        
                            divCartaz.addEventListener('click', (event) => {
                                while(generosModal.firstChild){
                                    generosModal.removeChild(generosModal.firstChild)
                                }
                                modalFilme.classList.remove('hidden');
                                const idDofilme = filmeAtual.id;
                                btnFecharModal.addEventListener('click', (event) =>{
                                    modalFilme.classList.add('hidden')
                                })
                                fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                                    const promiseBody = resposta.json();
                                    const spanDeSpan = document.createElement('span')
                                    promiseBody.then(body => {
                                        body.genres.forEach(genero => {
                                            const spanGenero = document.createElement('span');
                                            spanGenero.classList.add('modal__genre')
                                            spanGenero.textContent = genero.name
                                            spanDeSpan.append(spanGenero);
                                            spanDeSpan.append(' ')
                                        })
        
                                        tituloModal.textContent = body.title;
                                        imgModal.src = body.backdrop_path;
                                        descricaoModal.textContent = body.overview;
                                        notaModal.textContent = body.vote_average;
                                        generosModal.append(spanDeSpan);
                                        
                                    })
                                })
                                
                            })
                        
                            divSubCartaz.classList.add('movie__info');
                            divCartaz.classList.add('movie');
                            nomeFilme.classList.add('movie__title')
                            movieRating.classList.add('movie__rating')
                            movieRating.append(imagemEstrela);
                            movieRating.append(ratingNumero)
                            nomeFilme.textContent = filmeAtual.original_title
        
                            divSubCartaz.append(nomeFilme);
                            divSubCartaz.append(movieRating);
        
                            
                            divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                            divCartaz.append(divSubCartaz)
                            movies.append(divCartaz)
                        }
                    }
                })
                
                btnPrev.addEventListener('click', (event) => {
                    while(movies.firstChild){
                        movies.removeChild(movies.firstChild);
                    }
                    if (paginaDeFilmes === 0) {
                        paginaDeFilmes += 15;
                        for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                            const filmeAtual = body.results[i];
                            const divCartaz = document.createElement('div');
                            const divSubCartaz = document.createElement('div');
                            const nomeFilme = document.createElement('span');
                            const movieRating = document.createElement('span');
                            const imagemEstrela = document.createElement('img');
                            const ratingNumero = filmeAtual.vote_average
                            imagemEstrela.src = './assets/estrela.svg'
        
                            divCartaz.addEventListener('click', (event) => {
                                while(generosModal.firstChild){
                                    generosModal.removeChild(generosModal.firstChild)
                                }
                                modalFilme.classList.remove('hidden');
                                const idDofilme = filmeAtual.id;
                                btnFecharModal.addEventListener('click', (event) =>{
                                    modalFilme.classList.add('hidden')
                                })
                                fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                                    const promiseBody = resposta.json();
                                    const spanDeSpan = document.createElement('span')
                                    promiseBody.then(body => {
                                        body.genres.forEach(genero => {
                                            const spanGenero = document.createElement('span');
                                            spanGenero.classList.add('modal__genre')
                                            spanGenero.textContent = genero.name
                                            spanDeSpan.append(spanGenero);
                                            spanDeSpan.append(' ')
                                        })
        
                                        tituloModal.textContent = body.title;
                                        imgModal.src = body.backdrop_path;
                                        descricaoModal.textContent = body.overview;
                                        notaModal.textContent = body.vote_average;
                                        generosModal.append(spanDeSpan);
                                        
                                    })
                                })
                                
                            })
                        
                            divSubCartaz.classList.add('movie__info');
                            divCartaz.classList.add('movie');
                            nomeFilme.classList.add('movie__title')
                            movieRating.classList.add('movie__rating')
                            movieRating.append(imagemEstrela);
                            movieRating.append(ratingNumero)
                            nomeFilme.textContent = filmeAtual.original_title
        
                            divSubCartaz.append(nomeFilme);
                            divSubCartaz.append(movieRating);
        
                            
                            divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                            divCartaz.append(divSubCartaz)
                            movies.append(divCartaz)
                        }
                    }else {
                        paginaDeFilmes -= 5;
                        for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                            const filmeAtual = body.results[i];
                            const divCartaz = document.createElement('div');
                            const divSubCartaz = document.createElement('div');
                            const nomeFilme = document.createElement('span');
                            const movieRating = document.createElement('span');
                            const imagemEstrela = document.createElement('img');
                            const ratingNumero = filmeAtual.vote_average
                            imagemEstrela.src = './assets/estrela.svg'
        
                            divCartaz.addEventListener('click', (event) => {
                                while(generosModal.firstChild){
                                    generosModal.removeChild(generosModal.firstChild)
                                }
                                modalFilme.classList.remove('hidden');
                                const idDofilme = filmeAtual.id;
                                btnFecharModal.addEventListener('click', (event) =>{
                                    modalFilme.classList.add('hidden')
                                })
                                fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                                    const promiseBody = resposta.json();
                                    const spanDeSpan = document.createElement('span')
                                    promiseBody.then(body => {
                                        body.genres.forEach(genero => {
                                            const spanGenero = document.createElement('span');
                                            spanGenero.classList.add('modal__genre')
                                            spanGenero.textContent = genero.name
                                            spanDeSpan.append(spanGenero);
                                            spanDeSpan.append(' ')
                                        })
        
                                        tituloModal.textContent = body.title;
                                        imgModal.src = body.backdrop_path;
                                        descricaoModal.textContent = body.overview;
                                        notaModal.textContent = body.vote_average;
                                        generosModal.append(spanDeSpan);
                                        
                                    })
                                })
                                
                            })
                        
                            divSubCartaz.classList.add('movie__info');
                            divCartaz.classList.add('movie');
                            nomeFilme.classList.add('movie__title')
                            movieRating.classList.add('movie__rating')
                            movieRating.append(imagemEstrela);
                            movieRating.append(ratingNumero)
                            nomeFilme.textContent = filmeAtual.original_title
        
                            divSubCartaz.append(nomeFilme);
                            divSubCartaz.append(movieRating);
        
                            
                            divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                            divCartaz.append(divSubCartaz)
                            movies.append(divCartaz)
                        }
                    }
                })
        
        
        
                inputPesquisa.value = '';
                arrayDeFilmes = []

            })

        })
    }
})


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (resposta){
    const promiseBody = resposta.json();
    promiseBody.then((body) => {
        let arrayDeFilmes = [];
        
        for (let filme of body.results) {
            if (contador < quantidadeDeImagens) {
                const divCartaz = document.createElement('div');
                const divSubCartaz = document.createElement('div');
                const nomeFilme = document.createElement('span');
                const movieRating = document.createElement('span');
                const imagemEstrela = document.createElement('img');
                const ratingNumero = filme.vote_average
                imagemEstrela.src = './assets/estrela.svg'

                divCartaz.addEventListener('click', (event) => {
                    while(generosModal.firstChild){
                        generosModal.removeChild(generosModal.firstChild)
                    }
                    modalFilme.classList.remove('hidden');
                    const idDofilme = filme.id;
                    btnFecharModal.addEventListener('click', (event) =>{
                        modalFilme.classList.add('hidden')
                    })
                    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                        const promiseBody = resposta.json();
                        const spanDeSpan = document.createElement('span')
                        promiseBody.then(body => {
                            body.genres.forEach(genero => {
                                const spanGenero = document.createElement('span');
                                spanGenero.classList.add('modal__genre')
                                spanGenero.textContent = genero.name
                                spanDeSpan.append(spanGenero);
                                spanDeSpan.append(' ')
                            })

                            tituloModal.textContent = body.title;
                            imgModal.src = body.backdrop_path;
                            descricaoModal.textContent = body.overview;
                            notaModal.textContent = body.vote_average;
                            generosModal.append(spanDeSpan);
                            
                        })
                    })
                    
                })
                
                divSubCartaz.classList.add('movie__info');
                divCartaz.classList.add('movie');
                nomeFilme.classList.add('movie__title')
                movieRating.classList.add('movie__rating')
                movieRating.append(imagemEstrela);
                movieRating.append(ratingNumero)
                /* movieRating.textContent = filme.vote_average; */
                nomeFilme.textContent = filme.original_title

                divSubCartaz.append(nomeFilme);
                divSubCartaz.append(movieRating);

                
                divCartaz.style.backgroundImage = `url(${filme.poster_path})`

                divCartaz.append(divSubCartaz)
                movies.append(divCartaz)

                contador++
            }
        }
        
        btnNext.addEventListener('click', (event) => {
            paginaDeFilmes += 5;
            while(movies.firstChild){
                movies.removeChild(movies.firstChild);
            }
            
            if (paginaDeFilmes < 20) {
                for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                    const filmeAtual = body.results[i];
                    const divCartaz = document.createElement('div');
                    const divSubCartaz = document.createElement('div');
                    const nomeFilme = document.createElement('span');
                    const movieRating = document.createElement('span');
                    const imagemEstrela = document.createElement('img');
                    const ratingNumero = filmeAtual.vote_average
                    imagemEstrela.src = './assets/estrela.svg'

                    divCartaz.addEventListener('click', (event) => {
                        while(generosModal.firstChild){
                            generosModal.removeChild(generosModal.firstChild)
                        }
                        modalFilme.classList.remove('hidden');
                        const idDofilme = filmeAtual.id;
                        btnFecharModal.addEventListener('click', (event) =>{
                            modalFilme.classList.add('hidden')
                        })
                        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                            const promiseBody = resposta.json();
                            const spanDeSpan = document.createElement('span')
                            promiseBody.then(body => {
                                body.genres.forEach(genero => {
                                    const spanGenero = document.createElement('span');
                                    spanGenero.classList.add('modal__genre')
                                    spanGenero.textContent = genero.name
                                    spanDeSpan.append(spanGenero);
                                    spanDeSpan.append(' ')
                                })

                                tituloModal.textContent = body.title;
                                imgModal.src = body.backdrop_path;
                                descricaoModal.textContent = body.overview;
                                notaModal.textContent = body.vote_average;
                                generosModal.append(spanDeSpan);
                                
                            })
                        })
                        
                    })
                
                    divSubCartaz.classList.add('movie__info');
                    divCartaz.classList.add('movie');
                    nomeFilme.classList.add('movie__title')
                    movieRating.classList.add('movie__rating')
                    movieRating.append(imagemEstrela);
                    movieRating.append(ratingNumero)
                    nomeFilme.textContent = filmeAtual.original_title

                    divSubCartaz.append(nomeFilme);
                    divSubCartaz.append(movieRating);

                    
                    divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                    divCartaz.append(divSubCartaz)
                    movies.append(divCartaz)
                }
            }else {
                paginaDeFilmes = 0;
                for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                    const filmeAtual = body.results[i];
                    const divCartaz = document.createElement('div');
                    const divSubCartaz = document.createElement('div');
                    const nomeFilme = document.createElement('span');
                    const movieRating = document.createElement('span');
                    const imagemEstrela = document.createElement('img');
                    const ratingNumero = filmeAtual.vote_average
                    imagemEstrela.src = './assets/estrela.svg'

                    divCartaz.addEventListener('click', (event) => {
                        while(generosModal.firstChild){
                            generosModal.removeChild(generosModal.firstChild)
                        }
                        modalFilme.classList.remove('hidden');
                        const idDofilme = filmeAtual.id;
                        btnFecharModal.addEventListener('click', (event) =>{
                            modalFilme.classList.add('hidden')
                        })
                        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                            const promiseBody = resposta.json();
                            const spanDeSpan = document.createElement('span')
                            promiseBody.then(body => {
                                body.genres.forEach(genero => {
                                    const spanGenero = document.createElement('span');
                                    spanGenero.classList.add('modal__genre')
                                    spanGenero.textContent = genero.name
                                    spanDeSpan.append(spanGenero);
                                    spanDeSpan.append(' ')
                                })

                                tituloModal.textContent = body.title;
                                imgModal.src = body.backdrop_path;
                                descricaoModal.textContent = body.overview;
                                notaModal.textContent = body.vote_average;
                                generosModal.append(spanDeSpan);
                                
                            })
                        })
                        
                    })
                
                    divSubCartaz.classList.add('movie__info');
                    divCartaz.classList.add('movie');
                    nomeFilme.classList.add('movie__title')
                    movieRating.classList.add('movie__rating')
                    movieRating.append(imagemEstrela);
                    movieRating.append(ratingNumero)
                    nomeFilme.textContent = filmeAtual.original_title

                    divSubCartaz.append(nomeFilme);
                    divSubCartaz.append(movieRating);

                    
                    divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                    divCartaz.append(divSubCartaz)
                    movies.append(divCartaz)
                }
            }
        })
        
        btnPrev.addEventListener('click', (event) => {
            while(movies.firstChild){
                movies.removeChild(movies.firstChild);
            }
            if (paginaDeFilmes === 0) {
                paginaDeFilmes += 15;
                for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                    const filmeAtual = body.results[i];
                    const divCartaz = document.createElement('div');
                    const divSubCartaz = document.createElement('div');
                    const nomeFilme = document.createElement('span');
                    const movieRating = document.createElement('span');
                    const imagemEstrela = document.createElement('img');
                    const ratingNumero = filmeAtual.vote_average
                    imagemEstrela.src = './assets/estrela.svg'

                    divCartaz.addEventListener('click', (event) => {
                        while(generosModal.firstChild){
                            generosModal.removeChild(generosModal.firstChild)
                        }
                        modalFilme.classList.remove('hidden');
                        const idDofilme = filmeAtual.id;
                        btnFecharModal.addEventListener('click', (event) =>{
                            modalFilme.classList.add('hidden')
                        })
                        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                            const promiseBody = resposta.json();
                            const spanDeSpan = document.createElement('span')
                            promiseBody.then(body => {
                                body.genres.forEach(genero => {
                                    const spanGenero = document.createElement('span');
                                    spanGenero.classList.add('modal__genre')
                                    spanGenero.textContent = genero.name
                                    spanDeSpan.append(spanGenero);
                                    spanDeSpan.append(' ')
                                })

                                tituloModal.textContent = body.title;
                                imgModal.src = body.backdrop_path;
                                descricaoModal.textContent = body.overview;
                                notaModal.textContent = body.vote_average;
                                generosModal.append(spanDeSpan);
                                
                            })
                        })
                        
                    })
                
                    divSubCartaz.classList.add('movie__info');
                    divCartaz.classList.add('movie');
                    nomeFilme.classList.add('movie__title')
                    movieRating.classList.add('movie__rating')
                    movieRating.append(imagemEstrela);
                    movieRating.append(ratingNumero)
                    nomeFilme.textContent = filmeAtual.original_title

                    divSubCartaz.append(nomeFilme);
                    divSubCartaz.append(movieRating);

                    
                    divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                    divCartaz.append(divSubCartaz)
                    movies.append(divCartaz)
                }
            }else {
                paginaDeFilmes -= 5;
                for (let i = paginaDeFilmes; i < paginaDeFilmes + 5; i++) {
                    const filmeAtual = body.results[i];
                    const divCartaz = document.createElement('div');
                    const divSubCartaz = document.createElement('div');
                    const nomeFilme = document.createElement('span');
                    const movieRating = document.createElement('span');
                    const imagemEstrela = document.createElement('img');
                    const ratingNumero = filmeAtual.vote_average
                    imagemEstrela.src = './assets/estrela.svg'

                    divCartaz.addEventListener('click', (event) => {
                        while(generosModal.firstChild){
                            generosModal.removeChild(generosModal.firstChild)
                        }
                        modalFilme.classList.remove('hidden');
                        const idDofilme = filmeAtual.id;
                        btnFecharModal.addEventListener('click', (event) =>{
                            modalFilme.classList.add('hidden')
                        })
                        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idDofilme}`).then(resposta => {
                            const promiseBody = resposta.json();
                            const spanDeSpan = document.createElement('span')
                            promiseBody.then(body => {
                                body.genres.forEach(genero => {
                                    const spanGenero = document.createElement('span');
                                    spanGenero.classList.add('modal__genre')
                                    spanGenero.textContent = genero.name
                                    spanDeSpan.append(spanGenero);
                                    spanDeSpan.append(' ')
                                })

                                tituloModal.textContent = body.title;
                                imgModal.src = body.backdrop_path;
                                descricaoModal.textContent = body.overview;
                                notaModal.textContent = body.vote_average;
                                generosModal.append(spanDeSpan);
                                
                            })
                        })
                        
                    })
                
                    divSubCartaz.classList.add('movie__info');
                    divCartaz.classList.add('movie');
                    nomeFilme.classList.add('movie__title')
                    movieRating.classList.add('movie__rating')
                    movieRating.append(imagemEstrela);
                    movieRating.append(ratingNumero)
                    nomeFilme.textContent = filmeAtual.original_title

                    divSubCartaz.append(nomeFilme);
                    divSubCartaz.append(movieRating);

                    
                    divCartaz.style.backgroundImage = `url(${filmeAtual.poster_path})`
                    divCartaz.append(divSubCartaz)
                    movies.append(divCartaz)
                }
            }
        })

    }) 
})

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json(); 
    promiseBody.then((body) => {

        const arrayGenero = [];
    
        body.genres.forEach(genero => {
            arrayGenero.push(genero.name)
        });
    
        const generosDoDia = arrayGenero.join();

        videoHightLight.style.backgroundImage = `url(${body.backdrop_path})`
    
        highLightTitulo.textContent = body.original_title;
        highLightNota.textContent = body.vote_average;
        tagGenero.textContent = generosDoDia;
        descricaoHighligth.textContent = body.overview;
        tagLancamento.textContent = moment(body.release_date).lang('pt-BR').format('LL')
    })
    
})

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(resposta => {
    const promiseBody = resposta.json()
    promiseBody.then(body => {
        linkDoFilme.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    })
})