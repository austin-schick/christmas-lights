import React, { Component } from 'react';
import axios from "axios";
import { Grid, Text} from '@nextui-org/react';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const GridItem = ({callbackfn, text, imageurl, lightid, lightname }) => {
  return (<Grid xs={12} sm={4} md={3} lg={2}>
              <div className="card" onClick={() => callbackfn(lightid, lightname)}>
                <img src={imageurl}/>
                
                <div className="container">
                  <h4><b>{text}</b></h4>
                  <p>Select This Light Pattern!</p>
                </div>
              </div>
            </Grid>
 );}

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      light_pattern_list: [],
      selected_light_pattern: null
    };
  }   

  componentDidMount() {
    this.refresh_list();
    this.get_selected_light_pattern();
  }

  shouldComponentUpdate(newProps, newState) {
    // only render if the state has changed
    return this.state.selected_light_pattern !== newState.selected_light_pattern;
}

  convert_to_dict = (lp_list) => {
    var light_pattern_dict = {};

    for (var i = 0; i < lp_list.length; i++) {
      light_pattern_dict[ lp_list[i].id ] = lp_list[i];
    }
    return light_pattern_dict;

  };

  refresh_list = () => {
    axios
      .get("/api/options")
      .then((res) => this.setState({ light_pattern_list: this.convert_to_dict(res.data)}))
      .catch((err) => console.log(err));


    
  };

  get_selected_light_pattern = () => {
    axios
      .get("/api/selections/last")
      .then((res) => this.setState({ selected_light_pattern: res.data.light_pattern_id }))
      .catch((err) => console.log(err));
  }

  handle_selection = (selection_id, selection_name) => {
    const date = new Date();
    date.setTime(date.getTime()-date.getTimezoneOffset()*60*1000);
    const selection = {
      light_pattern_id: selection_id,
      timestamp: date.toISOString(),
    }
    console.log("selection", selection);
    console.log(selection_name);

    axios
      .post("/api/selections/", selection)
      .then((res) => this.get_selected_light_pattern())
      .catch((err) => console.log(err));

    console.log(this.state.selected_light_pattern)

    axios
      .post("/api/selections/updatepi/", {"light_pattern_name": selection_name,
                                          "parameters": ""})
      .catch((err) => console.log(err));
  }



  render_choices = () => {
    console.log(this.state.light_pattern_list);
    const selection_text = this.state.selected_light_pattern == null? "None! Select one below." : this.state.light_pattern_list[this.state.selected_light_pattern].title;
    const selection_description =  this.state.selected_light_pattern == null? "None! Select one below." : this.state.light_pattern_list[this.state.selected_light_pattern].description;
    const light_pattern_list = Object.values(this.state.light_pattern_list);
    return (
      <NextUIProvider>
        <Text h1
        css={{
          textGradient: "45deg, $red600 35%, $green600 65%",
          textAlign: "center",        }}
        weight="bold">Plaid Family Holiday Lights</Text>
        <Text h3 color="#2A2B2A" css={{textAlign: "center"}}>Select a light pattern. Watch the tree change. Enjoy!</Text>
        <Text h4 color="#706C61" css={{textAlign:"center"}}>Current Selection: {selection_text}</Text>
        <Text color="#706C61" css={{textAlign:"center"}}>{selection_description}</Text>
        <div className="outer-container">
        <Grid.Container gap={2}>
          {light_pattern_list.map((choice) => 
          <GridItem callbackfn={this.handle_selection} text={choice.title} imageurl={choice.image_url} lightid={choice.id} lightname={choice.animation_id}/>
          )}
      </Grid.Container>
      </div>
      </NextUIProvider>

    );
 
  };
  render(){
    return this.render_choices();
  }

}

export default App;
