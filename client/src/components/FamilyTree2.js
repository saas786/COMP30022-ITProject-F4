import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Label } from "semantic-ui-react";

class FamilyTree2 extends Component {
  state = {
    activeItem: "All",
    headerDesc: "List of All Artifacts"
  };

  handleItemClick = (e, { name, desc }) =>
    this.setState({ activeItem: name, headerDesc: desc });
  render() {
    // const { activeItem, headerDesc } = this.state;
    // const { headerDesc } = this.state
    return (
      <Container text style={{ padding: "0em 1em" }}>
        {/* <TreeWrapper /> */}
        <div>
          <title>Test Family Tree</title>
          {/* I found and adapted this css code from: https://stackoverflow.com/questions/38192074/family-tree-css */}
          {/* There is also an example on codepen.io at: http://codepen.io/Pestov/pen/BLpgm */}
          {/* I am not sure who the original creator is */}
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n* {\nmargin: 0;\npadding: 0;\n}\n.tree {\nwhite-space: nowrap;\nmin-width: 800px;\nmin-height:500px;\n}\n.tree ul {\npadding-top: 20px;\nposition: relative;\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n}\n.tree li {\nfloat: left;\ntext-align: center;\nlist-style-type: none;\nposition: relative;\npadding: 20px 5px 0 5px;\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n}\n/*We will use ::before and ::after to draw the connectors*/\n.tree li::before, .tree li::after {\ncontent: '';\nposition: absolute;\ntop: 0;\nright: 50%;\nborder-top: 1px solid #ccc;\nwidth: 50%;\nheight: 20px;\n}\n.tree li::after {\nright: auto;\nleft: 50%;\nborder-left: 1px solid #ccc;\n}\n/*We need to remove left-right connectors from elements without any siblings*/\n.tree li:only-child::after, .tree li:only-child::before {\ndisplay: none;\n}\n/*Remove space from the top of single children*/\n.tree li:only-child {\npadding-top: 0;\n}\n/*Remove left connector from first child and right connector from last child*/\n.tree li:first-child::before, .tree li:last-child::after {\nborder: 0 none;\n}\n/*Adding back the vertical connector to the last nodes*/\n.tree li:last-child::before {\nborder-right: 1px solid #ccc;\nborder-radius: 0 5px 0 0;\n-webkit-border-radius: 0 5px 0 0;\n-moz-border-radius: 0 5px 0 0;\n}\n.tree li:first-child::after {\nborder-radius: 5px 0 0 0;\n-webkit-border-radius: 5px 0 0 0;\n-moz-border-radius: 5px 0 0 0;\n}\n/*Time to add downward connectors from parents*/\n.tree ul ul::before {\ncontent: '';\nposition: absolute;\ntop: 0;\nleft: 50%;\nborder-left: 1px solid #ccc;\nwidth: 0;\nheight: 20px;\n}\n.tree li div {\nborder: 1px solid #ccc;\npadding: 5px 10px;\ntext-decoration: none;\ncolor: #666;\nfont-size: 15px;\ndisplay: inline-block;\nmin-width: 80px;\nmin-height: 30px;\nborder-radius: 5px;\n-webkit-border-radius: 5px;\n-moz-border-radius: 5px;\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n}\n.tree li div .male {\nbackground-color:#8fb4c4;\ndisplay: inline-block;\nwidth:90px;\npadding:10px;\nborder-radius: 5px;\n-webkit-border-radius: 5px;\n-moz-border-radius: 5px;\n}\n.tree li div .female {\nbackground-color:lightgrey;\ndisplay: inline-block;\nwidth:90px;\npadding:10px;\nborder-radius: 5px;\n-webkit-border-radius: 5px;\n-moz-border-radius: 5px;\n}\n.tree li div .spacer {\nbackground-color:lightblue;\ndisplay: inline-block;\nwidth:10px;\n}\n/*Time for some hover effects*/\n/*We will apply the hover effect the the lineage of the element also*/\n.tree li div:hover, .tree li div:hover + ul li div {\nbackground: #c8e4f8;\ncolor: #000;\nborder: 1px solid #94a0b4;\n}\n/*Connector styles on hover*/\n.tree li div:hover + ul li::after,\n.tree li div:hover + ul li::before,\n.tree li div:hover + ul::before,\n.tree li div:hover + ul ul::before {\nborder-color: #94a0b4;\n}\n"
            }}
          />
          <form id="form1">
            <div className="tree" id="FamilyTreeDiv">
              <ul>
                <li>
                  <div>
                    <Label className="female" as={Link} to={"/familymember/17"}>
                      Helen
                    </Label>
                    <span className="spacer" />
                    <Label className="male" as={Link} to={"/familymember/16"}>
                      Theodore
                    </Label>
                  </div>
                  <ul>
                    <li>
                      <li>
                        <div>
                          <Label
                            className="female"
                            as={Link}
                            to={"/familymember/9"}
                          >
                            Cynthia
                          </Label>
                        </div>
                        <ul>
                          <li>
                            <div>
                              <Label
                                className="male"
                                as={Link}
                                to={"/familymember/5"}
                              >
                                Barry
                              </Label>
                            </div>
                            <ul>
                              <li>
                                <div>
                                  <Label
                                    className="female"
                                    as={Link}
                                    to={"/familymember/29"}
                                  >
                                    Aviva
                                  </Label>
                                </div>
                              </li>
                              <li>
                                <div>
                                  <Label
                                    className="female"
                                    as={Link}
                                    to={"/familymember/28"}
                                  >
                                    Tamam
                                  </Label>
                                </div>
                              </li>
                              <li>
                                <div>
                                  <Label
                                    className="male"
                                    as={Link}
                                    to={"/familymember/27"}
                                  >
                                    Jeremy
                                  </Label>
                                </div>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div>
                              <Label
                                className="male"
                                as={Link}
                                to={"/familymember/4"}
                              >
                                David
                              </Label>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div>
                          <Label
                            className="female"
                            as={Link}
                            to={"/familymember/10"}
                          >
                            Ruth
                          </Label>
                        </div>
                      </li>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </form>
        </div>
        {/* <div className="header">
          <img src={mySvg} />
        </div> */}
      </Container>
    );
  }
}

export default FamilyTree2;
