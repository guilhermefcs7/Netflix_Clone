import React, { useEffect, useState }  from 'react';
import Tmdb from './Tmdb';

import './App.css'

import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      
    //pegando a lista total
    let list = await Tmdb.getHomeList();
    setMovieList(list);
    console.log(list)

    // pegando o featured
    let originals = list.filter(i=>i.slug === 'originals');
    let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1 ));
    let chosen = originals[0].items.results[randomChosen]
    let choseInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
    setFeaturedData(choseInfo)
    }
    
    loadAll();
  
  }, []);

  useEffect(()=> {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[])

  return(
    <div className="page">

      <Header black={blackHeader}/>

    {
      featuredData &&
      <FeaturedMovie item={featuredData}/>
    }


      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
      <span style={{color: '#F8D210',fontWeight:'bold'}}>©2021 Netflix Clone for studies. </span> <br/> All rights reserved to Netflix | All data rights reserved to Themoviedb.org  <br/> Made by Guilherme Falcão | Github: guilhermefcs7 <br/> 
      </footer>
    
      {movieList.length <=0 &&
      
      <div className="loading">
          <img src="https://c.tenor.com/Rfyx9OkRI38AAAAC/netflix-netflix-startup.gif" alt="Carregando"/>
      </div>
      } 
    </div>
  )
}