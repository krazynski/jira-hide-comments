import { useEffect, useState } from "react";

const emptyProject = { name: "projxect", rules: [] };
const emptyRule = { name: "rule", emoji: "" };

function App() {
  const [projects, setProjects] = useState([]);

  const saveConfig = () => {
    let value = JSON.stringify(projects);
    chrome.storage.sync.set({ config: value }).then(() => {});
  };

  const loadConfig = () => {
    chrome.storage.sync.get(["config"]).then((result) => {
      setProjects(JSON.parse(result.config));
    });
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <>
      <div className="min-w-64">
        <div className="">Projects</div>
        <div
          onClick={() => {
            setProjects([...projects, emptyProject]);
          }}>
          +
        </div>
        <div
          onClick={() => {
            saveConfig();
          }}>
          save
        </div>
        {projects.map((project) => {
          return <div>{project.name}</div>;
        })}
      </div>
    </>
  );
}

export default App;
