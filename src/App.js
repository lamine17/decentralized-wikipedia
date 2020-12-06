import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'

const NewArticle = () => {
  const [editor, setEditor] = useState(null)
  useEffect(() => {
    setEditor(new MediumEditor(`.${styles.editable}`))
  }, [setEditor])
  return (
    <form action='/article/add' >
      <div className={styles.subTitle}>Identifiant de votre article:</div>
      <div className={styles.mediumWrapper}>
      <textarea name="id" className={styles.editable} />
      </div>
      <div className={styles.subTitle}>Contenue de votre article:</div>
      <div className={styles.mediumWrapper}>
        <textarea name="contenue" className={styles.editable} />
      </div>
      <input type="submit" value="Envoyer" />
    </form>
  )
}

const Home = () => {
  return (
    <div className={styles.links}>
      <Link to="/">Home</Link>
      <Link to="/article/new">Ajouter un article</Link>
      <Link to="/article/one">Retrouver un article</Link>
      <Link to="/article/all">Tous les articles</Link>
    </div>
  )
}

const AddArticle = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const prmcont = urlParams.get('contenue');
	const prmid = parseInt(urlParams.get('id').replace(/<\/?[^>]+(>|$)/g, ""));
	const [articles, setArticles] = useState([])
	const contract = useSelector(({ contract }) => contract)
	if (contract) {
		try {
			console.log(prmid)
			contract.methods.addArticle(prmcont,prmid ).send()
			contract.methods.getAllIds().call().then(console.log)
		} catch (e) { }
	}
	return 	(<div><div>Votre article a été soumis avec succes!</div> 
		<form action='/'> <input type="submit" value="Retrouner à la page principale" /> </form></div>)
}

const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const contract = useSelector(({ contract }) => contract)
  useEffect(() => {
    if (contract) {
      contract.methods.articleContent(0).call().then(console.log)
      contract.methods.getAllIds().call().then(console.log)
    }
  }, [contract, setArticles])
  return <div>{articles.map(article => article)}</div>
}

const OneArticle = () => {
	  const [editor, setEditor] = useState(null)
	  useEffect(() => {
	    setEditor(new MediumEditor(`.${styles.editable}`))
	  }, [setEditor])
	  return (
	    <form action='/article/oneget' >
	      <div className={styles.subTitle}>Identifiant de l'article auquel vous souhaitez acceder:</div>
	      <div className={styles.mediumWrapper}>
	      <textarea name="id" className={styles.editable} />
	      </div>
	      <input type="submit" value="Rechercher" />
	    </form>
	  )
	}

const OneGet = () => {
	  const [article, setArticles] = useState([])
	  const urlParams = new URLSearchParams(window.location.search);
	const prmid = parseInt(urlParams.get('id').replace(/<\/?[^>]+(>|$)/g, ""));
	  const contract = useSelector(({ contract }) => contract)
	  useEffect(() => {
	    if (contract) {
	      contract.methods.articleContent(prmid).call().then(console.log)
	    }
	  }, [contract, setArticles])
	  
	  if(article==""){
		  return <div> <div> Aucun article correspondant à cet identifiant n'a été retrouvée.</div><form action='/'> <input type="submit" value="Retrouner à la page principale" /> </form></div>
	  }
	  return <div><div>{article}</div><form action='/'> <input type="submit" value="Retrouner à la page principale" /> </form></div>
	}

const NotFound = () => {
  return <div>Not found</div>
}

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])
  return (
    <div className={styles.app}>
      <div className={styles.title}>Bienvenue dans le Wikipedia décentralisé</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
	     <Route path="/article/one">
	       <OneArticle />
	      </Route>
	      <Route path="/article/oneget">
	      <OneGet />
	      </Route>
	        <Route exact path="/">
	          <Home />
	        </Route>
	        <Route path="/article/all">
	          <AllArticles />
	        </Route>
	      <Route path="/article/add">
	        <AddArticle />
	      </Route>
	        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
