import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { FaWandMagicSparkles } from "react-icons/fa6";
import Editor from "@monaco-editor/react";
import { GoCodeReview } from "react-icons/go";
import ScoreSquare from "./components/ScoreSquare";
import ProgressBar from "./components/ProgressBar";
import { FiFileText } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import CriticalBox from "./components/CriticalBox";
import WarningCom from "./components/WarningCom";
import SecurityAudit from "./components/SecurityAudit";
import { MdClose, MdDone } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { explain, main, fix } from "./AI";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import MarkdownPreview from "@uiw/react-markdown-preview";

// const sum = (a, b) => {
//     return a+b;
// }

const App = () => {
  const [isNoContent, setIsNoContent] = useState(true);
  const [screen, setScreen] = useState("analyze");
  const [language, setLanguage] = useState("html");
  const [code, setCode] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [explainData, setExplainData] = useState("");

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme("codeReviewTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8B7CFF" },
        {
          token: "entity.name.function",
          foreground: "2EE6A6",
          fontStyle: "bold",
        },
        { token: "identifier", foreground: "E6E6F0" },
        { token: "string", foreground: "FF9E7A" },
        { token: "number", foreground: "FFB86B" },
        { token: "comment", foreground: "808080", fontStyle: "italic" },
        { token: "type.identifier", foreground: "F6C177" },
        { token: "delimiter", foreground: "CFCFE6" },
      ],
      colors: {
        "editor.background": "#09090F",
        "editor.foreground": "#E6E6F0",
        "editorCursor.foreground": "#8B7CFF",
        "editor.lineHighlightBackground": "#11111A",
        "editor.selectionBackground": "#7C6BFF22",
        "editorLineNumber.foreground": "#4A4A5C",
        "editorLineNumber.activeForeground": "#8B7CFF",
        "editorGutter.background": "#09090F",
        "editorIndentGuide.background": "#1A1A26",
        "minimap.background": "#09090F",
        "editorSuggestWidget.background": "#11111A",
        "editorSuggestWidget.border": "#1F1F2E",
        "editorSuggestWidget.selectedBackground": "#1A1A26",
        "scrollbarSlider.background": "#1A1A26",
        "scrollbarSlider.hoverBackground": "#2A2A3D",
        "editorBracketMatch.background": "#1A1A26",
        "editorBracketMatch.border": "#8B7CFF",
        "editorGroup.border": "#1A1A26",
      },  
    });
  }

  const get_response = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze!");
      return;
    }

    try {
      setLoading(true);
      setScreen("analyze");
      setIsNoContent(false);

      const res = await main(code, language);

      console.log("RAW RESPONSE:", res);

      const parsed = JSON.parse(res);

      console.log("PARSED:", parsed);

      setData(parsed);
      } catch (error) {
        console.error(error);
        toast.error("Analysis failed. Please try again.");
        setIsNoContent(true);                     // ← reset on failure instead of fake data
      } finally {
        setLoading(false);
      }
    };

  const explain_data = async () => {
    try {
      if (code === "") {
        toast.error("Please enter some code to explain");
        return;
      }

      setLoading(true);
      let res = await explain(code, language);
      setExplainData(res);
      setIsNoContent(false);
      setScreen("explain");
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong", error);
    }
  };

  const fixCode = async() => {
    try{
      if(code === ""){
        toast.error("Please enter some code to fix");
        return;
      };

      setLoading(true);
    setScreen("fix");
    let res = await fix(code, language);
    console.log("FIX RESULT:", res);   // ← see what comes back
    setCode(res);
    setScreen("analyze");
  } catch (error) {
    console.error("FULL FIX ERROR:", error);          // ← open DevTools → Console
    toast.error(error?.message || JSON.stringify(error));  // ← show real message
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="left w-[50%] h-full flex flex-col">
          <div className="left-header flex items-center justify-between h-[4rem] px-[20px]">
            <div className="">
              <select
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
                value={language}
                className="language-selector"
              >
                <option value="html">HTML</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="r">R</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="perl">Perl</option>
                <option value="dart">Dart</option>
                <option value="scala">Scala</option>
                <option value="lua">Lua</option>
                <option value="matlab">MATLAB</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>

            <div>
              <button
                disabled={loading}
                onClick={get_response}
                className="blue-btn flex items-center gap-[10px]"
              >
                <i>
  {loading ? (
    <ClipLoader
      color={"#fff"}
      size={18}
      className="mt-1"
      aria-label={"Loading"}
    />
  ) : (
    <FaWandMagicSparkles />
  )}
</i>
                Analyze Code
              </button>
            </div>
          </div>

          <div className="code-editor">
            <Editor
              onChange={(code) => {
                setCode(code);
              }}
              value={code}
              height="100%"
              language={language.toLocaleLowerCase()}
              beforeMount={handleEditorWillMount}
              theme="codeReviewTheme"
            />
          </div>

          <div className="buttons px-[10px] flex items-center w-full gap-[10px]">
            <button onClick={fixCode} className="trans flex items-center gap-[10px] w-full justify-center">
              {loading ? (
                screen === "fix" ? (
                  <>
                    <ClipLoader
                      color={"#fff"}
                      size={18}
                      className="mt-1"
                      aria-label={"Loading"}
                    />{" "}
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              Fix Code
            </button>
            <button onClick={explain_data} className="trans flex items-center gap-[10px] w-full justify-center">
              {loading ? (
                screen === "explain" ? (
                  <>
                    <ClipLoader
                      color={"#fff"}
                      size={18}
                      className="mt-1"
                      aria-label={"Loading"}
                    />{" "}
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              Explain Code
            </button>
          </div>
        </div>

        <div className="right w-[50%] h-full overflow-auto">
          {isNoContent ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <i className="flex items-center justify-center p-[10px] w-[120px] h-[120px] rounded-[50%] bg-[var(--blue)] text-[55px]">
                <GoCodeReview />
              </i>
              <p className="text-white text-2xl mt-3 font-[700]">
                Analyze code
              </p>
              <p>to see result!</p>
            </div>
          ) : (
            ""
          )}

          {screen === "analyze" && !isNoContent ? (
            <div className="w-full h-full overflow-auto p-[20px]">
              <div className="flex items-center gap-[15px]">
                {data && <ScoreSquare score={data.overallScore} />}
                <div>
                  <h3 className="text-[35px] font-[700] m-0 p-0">
                    Overall Score
                  </h3>
                  <p className="-mt-1 text-gray-400">
                    Analysis complete based on rules
                  </p>
                </div>
              </div>

              <div className="gridBox items-center mt-6">
                {/* <ProgressBar name={"test"} score={90} />*/}

                {data?.scoreBreakdown?.map((item, index) => (
                  <ProgressBar
                    key={index}
                    name={item.name}
                    score={item.score}
                  />
                ))}
              </div>

              <div className="summary mt-6 p-[15px] bg-[#17192C] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <i className="text-[25px] text-[var(--blue)]">
                      <FiFileText />
                    </i>
                    <h3 className="font-[700] text-[20px] text-[var(--blue)]">
                      Summary
                    </h3>
                  </div>
                  <i className="text-[30px] text-gray-500">
                    <BsStars />
                  </i>
                </div>
                <p className="text-gray-400 mt-2">{data?.summary}</p>
              </div>

              {data?.critical ? (
                data.critical.length > 0 ? (
                  <>
                    <div className="critical_con mt-6">
                      <p className="text-[#FFB4AB] font-[700] mb-2">CRITICAL</p>

                      {/* <CriticalBox data={{title: "Error Handling" , description: "Your code lacks error handling, which can lead to unexpected behavior and crashes. Implement try-catch blocks to handle potential errors." , icon: "FaFileAlt"}} */}

                      {data?.critical
                        ? data.critical.length > 0
                          ? data.critical.map((item, index) => (
                              <CriticalBox
                                key={index}
                                data={{
                                  title: item.title,
                                  description: item.description,
                                  icon: item.icon,
                                }}
                              />
                            ))
                          : ""
                        : ""}
                    </div>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {data?.warnings ? (
                data.warnings.length > 0 ? (
                  <>
                    <div className="warning_con mt-6">
                      <p className="text-[#FFB783] font-[700] mb-2">WARNING</p>
                      {/* <WarningCom data={{title: "Unused Variables (1)" , line:"3"}}/> */}

                      {data?.warnings?.length > 0 ? (
                        data.warnings.map((item, index) => (
                          <WarningCom
                            key={index}
                            data={{
                              title: item.title,
                              line: item.line,
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-gray-400">No warnings found.</p>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {data?.securityAudit ? (
                data?.securityAudit?.metrics?.length > 0 ? (
                  <>
                    <div className="security_audit mt-6">
                      <p className="text-gray-400 font-[700] mb-2">
                        Security Audit
                      </p>
                      <div className="flex items-center gap-[15px]">
                        {/* <SecurityAudit data={{name: "OWASP Score" , value:"D-"}} /> */}

                        {data?.securityAudit?.metrics?.length > 0 ? (
                          data.securityAudit.metrics.map((item, index) => (
                            <SecurityAudit
                              key={index}
                              data={{
                                name: item?.name,
                                value: item?.value,
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-gray-400">
                            No security audit issues found.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {data?.compilanceStandards ? (
                data?.compilanceStandards?.length > 0 ? (
                  <>
                    <div className="Compilace-Standards mt-6">
                      <p className="text-gray-400 font-[700] mb-5">
                        Compliance Standards
                      </p>

                      <div className="flex items-center gap-[15px] mb-2">
                        <i className="text-[20px] text-green-500">
                          <MdDone />
                        </i>
                        <p>Strict Typing Enforced</p>
                      </div>

                      <div className="flex items-center gap-[15px]">
                        <i className="text-[20px] text-gray-400">
                          <MdClose />
                        </i>
                        <p>Missing Error Handling</p>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              <div className="protip mb-3 mt-6 p-[15px] bg-[#101019] rounded-lg">
                <div className="flex items-center gap-[15px]">
                  <i className="text-[17px] text-[var(--blue)]">
                    <HiOutlineLightBulb />
                  </i>
                  <p className="font-[700] text-[16px]">PRO TIP</p>
                </div>
                <p className="text-[14px] text-gray-500 mt-2">
                  Parametrs binding prevents <b>SQL Injection</b> by ensuring
                  that user input is never executed as code. This is industry
                  standard for database security.
                </p>
              </div>
            </div>
          ) : screen === "explain" ? (
            <div className="w-full h-full overflow-auto p-[20px]">
              <MarkdownPreview source={explainData} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default App;
