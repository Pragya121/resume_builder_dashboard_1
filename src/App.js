import "./App.css";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import swal from "sweetalert";
import Loading from "./components/Loading";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import InspectModule from "docxtemplater/js/inspect-module";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import data from "./assets/data";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Signin from "./components/Signin";
import { Outlet, Link } from "react-router-dom";
import { GiPaperArrow } from "react-icons/gi";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { isCursorAtEnd } from "@testing-library/user-event/dist/utils";
function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignedout, setIsSignedout] = React.useState(false);

  const [finalObj1, setfinalObj1] = React.useState({});
  const [sectionNamesf, setsectionNamesf] = React.useState([]);
  const [newOrderedSections, setnewOrderedSections] = React.useState([]);
  const [fields, setFields] = React.useState([]);
  const [token, setToken] = React.useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  const postDoc = async (finalData) => {
    setIsLoading(true);
    let idToken = await data.getIdToken();
    if (!idToken) {
      idToken = token;
    }
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      };
      const response = await data.axios.post(
        `${data.BASE_URL}/resumeTemplates`,
        finalData,
        config
      );

      const resp = response.data;
      alert(resp);

      console.log(`info`, resp);

      setIsLoading(false);
      return resp;
    } catch (errors) {
      console.error(errors);
      alert(errors.response.data);
      setIsLoading(false);
    }
  };

  const generateDocument = () => {
    setIsLoading(true);
    let previewFile = document.getElementById("preview-selector").files[0];
    let docFile = document.getElementById("doc-selector").files[0];
    let templateName = document.getElementById("templateName").value;
    let category = document.getElementById("tempCategory").value;

    let previewUrl = "";
    let docUrl = "";
    if (!previewFile) {
      alert("Please add resume file preview");
      setIsLoading(false);
      return;
    }
    if (!docFile) {
      alert("Please add resume file");
      setIsLoading(false);
      return;
    }
    if (!templateName) {
      alert("Please add resume  name");
      setIsLoading(false);
      return;
    }
    if (!category) {
      alert("Please add resume file tags/category");
      setIsLoading(false);
      return;
    }
    let text = {};

    loadFile(
      // 'https://docxtemplater.com/tag-example.docx',

      URL.createObjectURL(docFile),

      function (error, content) {
        if (error) {
          setIsLoading(false);
          alert("There is some error in document.");
          throw error;
        }
        var zip = new PizZip(content);
        const iModule = InspectModule();
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          modules: [iModule],
        });

        const tags = iModule.getAllTags();
        console.log(tags);
        text = { ...tags };
        console.log(text);
        let sectionNames = Object.keys(text);
        let obj = { Basic_Details: [] };
        for (let key of sectionNames) {
          let comp = Object.keys(text[key]);
          if (comp.length !== 0) {
            obj[key] = comp;
          } else obj.Basic_Details.push(key);
        }
        // setIsLoading(false);

        setsectionNamesf(Object.keys(obj));
        console.log(sectionNamesf);
        console.log(obj);
        let arr = [];
        let temp = Object.values(obj);
        temp.map((val) => {
          arr.push(...val);
        });
        setFields(arr);
        //uploading prteview an doc one by one
        try{
          
        const storage = getStorage();
        let fileNameParts;
        let strName = "";

        fileNameParts = previewFile.name.split(".");

        var metadata = {
          contentType: previewFile.type,
        };

        strName = `resumeBuilder/${templateName}/${uuidv4()}/${templateName}-preview.${
          fileNameParts[fileNameParts.length - 1]
        }`;

        const storageRef = ref(storage, strName);
        const uploadTask = uploadBytes(storageRef, previewFile, metadata);
        uploadTask.then((result) => {
          console.log("after upload Task ", result);
          getDownloadURL(ref(storage, strName)).then((url) => {
            console.log("Preview Url", url);
            previewUrl = url;
            fileNameParts = docFile.name.split(".");

            var metadata = {
              contentType: docFile.type,
            };

            strName = `resumeBuilder/${templateName}/${uuidv4()}/${templateName}-doc.${
              fileNameParts[fileNameParts.length - 1]
            }`;

            const storageRef = ref(storage, strName);
            const uploadTask = uploadBytes(storageRef, docFile, metadata);
            uploadTask.then((result) => {
              console.log("after upload Task ", result);
              getDownloadURL(ref(storage, strName)).then((durl) => {
                console.log("Doc Url", durl);
                docUrl = durl;
                let finalData = {
                  name: templateName,
                  tags: category,
                  previewImageLink: previewUrl,
                  templateFileLink: docUrl,
                  sections: Object.keys(obj),
                  fields: obj,
                };
                setfinalObj1(finalData);
                setIsLoading(false);
                swal({
                  title: "Are you sure to proceed?",
                  text: "Please check the order of sections and change it if required and add fields with add more button",

                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willProceed) => {
                  if (willProceed) {
                    setShowDialog(true);
                  } else {
                    swal("Please re-upload the files and click proceed");
                    return;
                  }
                });
              });
            });
          });
        });
        }catch(e){
          console.log(e);
          swal({
            text: "Error encountered, please retry",
            icon: "error",
          });
        }
      }
    );
  };
  const signOut = (e) => {
    setIsLoading(true);
    setIsSignedout(true);
    data
      .signOut(data.auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out");
        localStorage.removeItem("token");
        localStorage.removeItem("loginData");
        setIsLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
        alert("error in signing out!");
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    //statements
  }, []);
  if (token) {
    if (!isLoading) {
      return (
        <div className="App">
          <Navbar />

          <div className="body">
            {" "}
            <div>
              <label>Name of Resume Template</label>
              <input id="templateName" />
            </div>
            <div>
              <label>Tags</label>
              <input id="tempCategory" />
            </div>
            <div>
              {" "}
              <label>Select a .docx file:</label>
              <input
                type="file"
                id="doc-selector"
                accept=".doc,.docx"
                onChange={(event) => {
                  const fileList = event.target.files[0];

                  console.log(fileList);
                }}
              />
            </div>
            <div>
              {" "}
              <label>Select a preview image</label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                id="preview-selector"
                onChange={(event) => {
                  const file = event.target.files[0];

                  let preview = document.getElementById("preview");
                  console.log(file);
                  if (file) {
                    preview.src = URL.createObjectURL(file);
                  }
                }}
              />
              <img
                id="preview"
                src="#"
                alt="preview will be shown here"
                width="100px"
                height="100px"
              />
            </div>
            <div className="body">
              <button onClick={generateDocument}>
                {" "}
                <GiPaperArrow /> Proceed
              </button>
            </div>
          </div>

          <Footer />
          <Dialog
            style={{ color: "green", fontFamily: "Verdana" }}
            isOpen={showDialog}
            onDismiss={close}
          >
            <div>
              <p>
                {" "}
                Please check the order of sections, you can re order it if
                necessary.
              </p>
              {sectionNamesf.map((item, index) => {
                let i = 0;

                return (
                  <div>
                    <table>
                      <tbody>
                        <tr
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            const n = sectionNamesf.indexOf(item);
                            // newOrderedSections[index] = item;
                            let arr = [...newOrderedSections];
                            arr.push(item);
                            setnewOrderedSections(arr);
                            if (n > -1) {
                              // only splice array when item is found
                              sectionNamesf.splice(n, 1); // 2nd parameter means remove one item only
                            }
                            i = i + 1;
                          }}
                        >
                          {" "}
                          <a
                            style={{ cursor: "pointer" }}
                            onmouseover="this.style.color='orange';"
                            onmouseout="this.style.color="
                          >
                            {item}
                          </a>{" "}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
              <div>
                <p>The new order of sections is</p>
                {newOrderedSections.map((item, index) => {
                  let i = 0;
                  return <li>{item}</li>;
                })}
              </div>
            </div>
            <button
              hidden={newOrderedSections.length > 0}
              onClick={(e) => {
                let arr = [...sectionNamesf];

                setnewOrderedSections(arr);
              }}
            >
              {" "}
              Don't change order
            </button>

            <div>
              <p>Please select the fields to have add more button</p>
              {fields.map((listItem, i) => {
                return (
                  <li key={i}>
                    <input type="checkbox" value={listItem} />
                    {listItem}
                  </li>
                );
              })}
            </div>

            <button
              onClick={(e) => {
                const values = Array.from(
                  document.querySelectorAll('input[type="checkbox"]')
                )
                  .filter((checkbox) => checkbox.checked)
                  .map((checkbox) => checkbox.value);
                let finalData = {
                  name: finalObj1.name,
                  tags: finalObj1.tags,
                  previewImageLink: finalObj1.previewImageLink,
                  templateFileLink: finalObj1.templateFileLink,
                  sections: finalObj1.sections,
                  fields: finalObj1.fields,
                  addmore: values,
                };
                console.log(finalData);
                postDoc(finalData).then((res) => {
                  console.log(finalData);
                  setIsLoading(false);
                });
                close();
              }}
            >
              Okay, all done
            </button>
          </Dialog>
        </div>
      );
    } else {
      return <Loading />;
    }
  } else {
    return <Signin />;
  }
}

export default App;
