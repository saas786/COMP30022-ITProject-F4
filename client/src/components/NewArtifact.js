import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import PropTypes from "prop-types";
import { Button,
         Form,
         Container,
         Input,
         Icon,
         Header,
         Modal,
         Image,
         Label,
         Message,
         Loader,
         Segment,
         Transition,
         Search } from 'semantic-ui-react';

//Http response status for create
const HTTP_RES_POST = 201;

const resultRenderer = ({ title }) => <Label content={title} />;

resultRenderer.propTypes = {
  name: PropTypes.string
};

class NewArtifact extends Component {
  constructor() {
    super();

    this.state = {
      Name: "",
      GeoTag: "",
      Day: "",
      Month: "",
      Year: "",
      Description: "",
      isLoading: false,
      successMessage: false,
      failureMessage: false,
      tags: [],
      file: [],
      filename: [],
      lastAdded: "",
      addArtifactStatus: false,
      imagePreview: [],
      previewOn: false,
      redirect: false,
      familyMembers: null,
      searchIsLoading: false,
      results: [],
      value: "",
      currOwner: 0
    };

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get("/api/familymember/all").then(res => {
      var arrMembers = [];
      var members = JSON.parse(JSON.stringify(res.data));

      members.forEach(function(member, i) {
        var fullName = member.FirstName + " " + member.LastName;
        var newMemberObj = {
          id: member.FamilyMemberID,
          title: fullName
        };
        arrMembers.push(newMemberObj);
      });

      this.setState({ familyMembers: arrMembers });
    });
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    this.setState({ currOwner: result.id });
    console.log(this.state.currOwner);
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ searchIsLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1)
        return this.setState({
          searchIsLoading: false,
          results: [],
          value: ""
        });

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");

      const isMatch = result => {
        return re.test(result.title);
      };

      this.setState({
        searchIsLoading: false,
        results: _.filter(this.state.familyMembers, isMatch)
      });
    }, 300);
  };

  // Request to add artifacts to database
  requestAddArtifact(data) {
    // POST route via backend for artifacts
    fetch("/artifacts/new", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === HTTP_RES_POST) {
        this.setState({ addArtifactStatus: true });
      }
    });
  }

  // Request foreign key for last added artifact
  requestLastAddedArtifact() {
    axios.get("/artifact/lastAdded").then(res => {
      this.setState({ lastAdded: res.data.lastAdded });
    });
  }

  //Upload images to /artifactImages server
  requestUploadServer(data) {
    // POST route for image upload
    axios
      .post("/upload/artifactimage", data, {
        headers: { "content-type": "multipart/form-data" }
      })
      .then(res => {
        for (var x = 0; x < this.state.file.length; x++) {
          var name = res.data[x].filename;
          this.setState({
            filename: [...this.state.filename, name]
          });
        }
      });
  }

  // Request to add image to database
  requestAddImage(data) {
    // POST route for adding image to database
    fetch("/new/artifactImage", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === HTTP_RES_POST) {
        this.setState({ isLoading: false });
        this.setState({ successMessage: true });
        this.props.history.push("/artifacts/objects");
      }
    });
  }

  // Handles multiple submission for all form fields
  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });

    if (this.state.Name === '' || this.state.currOwn === 0) {
      this.setState({ isLoading: false })
      this.setState({ failureMessage: true });
      setTimeout(() => {
        this.setState({failureMessage: false });
      }, 2000)

    } else {

      // Data for artifacts
      const artifactData = {
        Name: this.state.Name,
        GeoTag: this.state.GeoTag,
        Day: this.state.Day,
        Month: this.state.Month,
        Year: this.state.Year,
        Description: this.state.Description,
        Tags: this.state.tags,
        currOwn: this.state.currOwner
      };

      await this.requestAddArtifact(artifactData);

      if(this.state.file.length !== 0 ) {
        // Data for artifact image
        const imageData = new FormData();
        for (var x = 0; x < this.state.file.length; x++) {
          imageData.append("file", this.state.file[x]);
        }
        await this.requestLastAddedArtifact();

        const timer = 2000;

        setTimeout(() => {
          this.requestUploadServer(imageData);
        }, timer - 300);

        setTimeout(() => {
          for (var x = 0; x < this.state.file.length; x++) {
            const addImageData = {
              filename: this.state.filename[x],
              lastAdded: this.state.lastAdded
            };
            this.requestAddImage(addImageData);
          }
        }, timer);
      } else {
        console.log("no image")
        this.setState({ isLoading: false });
        this.setState({ successMessage: true });
        setTimeout(() => {
          this.setState({ successMessage: false });
          this.props.history.push("/artifacts/objects");
        }, 1500)
      }
    }
  }

  handleImageChange = e => {
    e.preventDefault();

    let listFiles = Array.from(e.target.files);

    listFiles.forEach(img => {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          file: [...this.state.file, img],
          imagePreview: [...this.state.imagePreview, reader.result]
        });
      };
      reader.readAsDataURL(img);
    });
    this.setState({ previewOn: true });
    // this.setState({
    //   file: e.target.files,
    //   imagePreview: URL.createObjectURL(e.target.files)
    // })
  };

  handleChange = e => {
    // Constantly updates changes in user input
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // This function is used to detect when keyboard enter key is pressed
  inputKeyDown = e => {
    // Controlled field when enter key is pressed for tags
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      // Prevent user from entering duplicate tags
      if (
        this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val] });
      this.tagInput.value = null;
    }
  };

  //This function is used to delete specific tags from an array
  removeTag = i => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  };

  render() {
    //Some constants that are used in rendering state
    const {
            isLoading, successMessage, failureMessage, tags,
            searchIsLoading, value, results
          } = this.state;

    return (
      <div>
        <Container textAlign="center">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              {/*Form for name*/}
              <Form.Field required>
                <label>
                  {" "}
                  Name
                  {/* <Popup content='This field is mandatory' trigger={
                 <Icon name='info circle' size =''/>}/> : */}
                </label>
                <Input
                  placeholder="Input name of artifact"
                  name="Name"
                  onChange={this.handleChange}
                />
              </Form.Field>

              {/*Form for location*/}
              <Form.Field>
                <label>
                  {" "}
                  GeoTag
                  {/* <Popup content='This field is optional' trigger={
                 <Icon name='info circle' size ='large'/>}/> : */}
                </label>
                <Input
                  placeholder="Current location of artifacts"
                  name="GeoTag"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form.Group>

            {/*Form for dates*/}
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Day"
                placeholder="DD"
                name="Day"
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Month"
                placeholder="MM"
                name="Month"
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Year"
                placeholder="YYYY"
                name="Year"
                onChange={this.handleChange}
              />
            </Form.Group>

            {/*Form for History input*/}
            <Form.Field>
              <label> History</label>

              <Form.TextArea
                placeholder="A short description"
                name="Description"
                onChange={this.handleChange}
              />
            </Form.Field>

            {/*Form for searching family member*/}
            <Container textAlign="center">
              <Form.Field required>
                <label>Search owner of artifact:</label>

                <Search
                  loading={searchIsLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true
                  })}
                  results={results}
                  value={value}
                  resultRenderer={resultRenderer}
                  {...this.props}
                />
              </Form.Field>
            </Container>

            {/*Modal and form for adding multiple tags*/}
            <Form.Field>
              <label> Click this to add tags:</label>
              <Modal
                size="mini"
                closeIcon
                trigger={<Button type="Button" icon="tags"></Button>}
              >
                <Modal.Header>Add multiple tags</Modal.Header>
                <Container textAlign="center">
                  <Modal.Description textalign="center">
                    <input
                      style={{
                        margin: 10,
                        width: "85%",
                        height: "30px",
                        fontSize: "12pt",
                        borderRadius: "4px"
                      }}
                      placeholder='Press "Enter" key to keep adding'
                      onKeyDown={this.inputKeyDown}
                      ref={c => {
                        this.tagInput = c;
                      }}
                    />
                    {tags.map((tag, i) => (
                      <Label style={{ marginBottom: 5 }} key={tag} size="large">
                        {tag}
                        <Icon
                          name="delete"
                          onClick={() => {
                            this.removeTag(i);
                          }}
                        />
                      </Label>
                    ))}
                  </Modal.Description>
                </Container>
              </Modal>
            </Form.Field>

            <Label as="a" tag color="teal" size="large">
              Added tags:{" "}
            </Label>
            {tags.map((tag, i) => (
              <Label style={{ marginBottom: 5 }} key={tag} size="large">
                {tag}
                <Icon
                  name="delete"
                  onClick={() => {
                    this.removeTag(i);
                  }}
                />
              </Label>
            ))}

            {/* Field to select multiple images */}
            <Segment>
              <Form.Field>
                <Input
                  type="file"
                  name="file"
                  multiple
                  onChange={this.handleImageChange}
                  label="Select Images:"
                />
              </Form.Field>
            </Segment>

            <Transition
              visible={this.state.previewOn}
              animation="scale"
              duration={500}
            >
              <Segment>
                <Header> - Preview - </Header>
                <Image.Group size="small">
                  {this.state.imagePreview.map(preview => {
                    return (
                      <Image key={preview} alt="previewImg" src={preview} />
                    );
                  })}
                </Image.Group>
              </Segment>
            </Transition>

            {/*Loader for waiting HTTP post request response*/}
            <Modal open={isLoading}>
              <Loader intermediate="true" size="huge">
                Uploading Artifact
              </Loader>
            </Modal>

            {/*Message to show successfull registration of artifact*/}
            <Modal open={successMessage}>
              <Container textAlign="center">
                <Message icon success>
                  <Icon name="checkmark" />
                  <Message.Content>
                    <Message.Header>Success!</Message.Header>
                    Artifact has been successfully registered into our database.
                    <p>Redirecting you to physical artifacts page ...... </p>
                  </Message.Content>
                </Message>
              </Container>
            </Modal>

            {/*Message to failed registration of artifact*/}
            <Modal open={failureMessage}>
              <Container textAlign="center">
                <Message icon negative>
                  <Icon name="checkmark" />
                  <Message.Content>
                    <Message.Header>
                      An unexpected error has occured!
                    </Message.Header>
                      Please ensure that all required fields are field in properly!
                      Specifically Name & Owner of artifact field!
                  </Message.Content>
                </Message>
              </Container>
            </Modal>

            {/*Final button for all form submission*/}
            <Button color="blue" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default NewArtifact;
