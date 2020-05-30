import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import chunk from 'lodash.chunk';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Figure from 'react-bootstrap/Figure'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import { retrivieChampions } from './ducks/championsSlice';
import { setFilterByName } from './ducks/filteringSlice';
import { ROOT_LOL_API } from './utils/env';

function App() {
  const [selectedChampion, setSelectedChampion] = useState(null);

  const dispatch = useDispatch();
  const {
    isLoading,
    isError,
    items: champions,
  } = useSelector(state => state.champions);

  const filterName = useSelector(state => state.filtering.filterByName)

  let key = 0;

  useEffect(() => {
    dispatch(retrivieChampions())
  }, [dispatch])

  if ( isLoading ) {
    return <p>Está carregando...</p>
  }

  if ( isError ) {
    return <p>Deu erro ao carregar dados...</p>
  }

  const filteredChampions = champions.filter(listChampion => listChampion.name.toLowerCase().includes(filterName.toLowerCase()));
  const championsRows = chunk(filteredChampions, 6);

  return (
    <div>
      <Container as="header">
        <h1>Escolha seu campeão...</h1>
      </Container>
      <Container>
        <ChampionFilterForm />        
      </Container>
      <Container>
        {championsRows.map(champions => (
          <Row key={key += 1}>
            {champions.map(champion => (
              <Col key={champion.id} onClick={() => setSelectedChampion(champion.id)}>
                <Figure>
                  <Figure.Image
                    width={champion.image.w}
                    height={champion.image.h}
                    alt={`Foto de ${champion.name}`}
                    src={`${ROOT_LOL_API}img/champion/${champion.image.full}`}
                  />
                  <Figure.Caption>
                    {champion.name}
                  </Figure.Caption>
                </Figure>                
              </Col>
            ))}
          </Row>
        ))}
      </Container>
      {selectedChampion && (
        <ChampionDetailsDialog 
          championId={selectedChampion} 
          onClose={() => setSelectedChampion(null)}
        />      
      )}      
      
    </div>
  );
}

const ChampionDetailsDialog = ({championId, onClose}) => {
  const champion = useSelector(state => state.champions.items.find(c => c.id === championId));

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{champion.name}, <small>{champion.title}</small></Modal.Title>
      </Modal.Header>
      <Modal.Body>{champion.blurb}</Modal.Body>      
    </Modal>
  )
};

const ChampionFilterForm = () => {
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    dispatch(setFilterByName(event.target.value));
  };

  return (
    <Form>
      <Form.Group controlId="filterByName">        
        <Form.Control placeholder="Digite o campeão desejado" onChange={handleNameChange} />                
      </Form.Group>
    </Form>
  )
};

export default App;
