import React, { Component } from 'react';
import axios from "axios";
import { Grid, Card, Text, Button, Image, Col} from '@nextui-org/react';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      light_pattern_list: [],
      selected_light_id: null
    };
  }

  componentDidMount() {
    this.refresh_list();
    this.get_selected_light_pattern();
  }

  refresh_list = () => {
    axios
      .get("/api/options")
      .then((res) => this.setState({ light_pattern_list: res.data }))
      .catch((err) => console.log(err));
  };

  get_selected_light_pattern = () => {
    axios
      .get("/api/selections/last")
      .then((res) => this.setState({ selected_light_id: res.data.light_pattern_id }))
      .catch((err) => console.log(err));
  }

  handle_selection = (selection_id) => {
    const date = new Date();
    date.setTime(date.getTime()-date.getTimezoneOffset()*60*1000);
    const selection = {
      light_pattern_id: selection_id,
      timestamp: date.toISOString(),
    }

    axios
      .post("/api/selections/", selection)
      .then((res) => this.get_selected_light_pattern())
      .catch((err) => console.log(err));
  }



  render_choices = () => {
    console.log(this.state.selected_light_id);
    const MockItem = ({ text, imageurl, selected_light_id }) => {
     return (
      <Card variant="shadow" isHoverable isPressable onPress={() => this.handle_selection(selected_light_id)} css={{ maxWidth: "100%" }}>
        <Card.Body css={{ p: 0 }}>
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
          <Col>
            <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
              Select Light Pattern
            </Text>
            <Text h4 color="white">
              {text}
            </Text>
          </Col>
        </Card.Header>
        <Card.Image
          src={imageurl}
          objectFit="cover"
          width="100%"
          height={340}
          alt="Card image background"
    />
    </Card.Body>
      </Card>
    );}
  
    return (
      <NextUIProvider>
        <Grid.Container gap={2} justify="flex-start" alignContent="center" css={{margin: "0 auto"}}>
          {this.state.light_pattern_list.map((choice) => 
          <Grid alignContent="center">
          <MockItem text={choice.title} imageurl={choice.image_url} selected_light_id={choice.id}/>
        </Grid>
          )}
        </Grid.Container>
      </NextUIProvider>
    );
 
  };

  render(){
    console.log(this.render_choices());
    return this.render_choices();


  }

}

export default App;
