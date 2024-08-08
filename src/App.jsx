import { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Plus, Save, Trash } from "lucide-react";

function App() {
  const [projects, setProjects] = useState([]);

  const saveConfig = () => {
    let value = JSON.stringify(projects);
    chrome.storage.sync.set({ config: value }).then(() => {});
  };

  const loadConfig = () => {
    chrome.storage.sync.get(["config"]).then((result) => {
      let parsed = JSON.parse(result.config);

      if (parsed) {
        setProjects(parsed);
      }
    });
  };

  function addRule(index) {
    const newProjects = [...projects];
    newProjects[index].rules[newProjects[index].rules.length] = {
      name: "",
      emoji: "",
    };
    setProjects(newProjects);
  }

  function addProject() {
    const newProjects = [...projects, { name: "", rules: [] }];
    setProjects(newProjects);
  }

  function updateProjectName(index, name) {
    const newProjects = [...projects];
    newProjects[index].name = name;
    setProjects(newProjects);
  }

  function updateRuleEmoji(index, ruleIndex, emoji) {
    const newProjects = [...projects];
    const newRules = [...newProjects[index].rules];
    newRules[ruleIndex].emoji = emoji;
    newProjects[index].rules = newRules;
    setProjects(newProjects);
  }

  function removeProject(index) {
    const newProjects = [...projects];

    newProjects.splice(index, 1);

    setProjects(newProjects);
  }

  function removeRule(index, ruleIndex) {
    const newProjects = [...projects];
    const newRules = [...newProjects[index].rules];
    newRules.splice(ruleIndex, 1);
    newProjects[index].rules = newRules;

    setProjects(newProjects);
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <>
      <div className="min-w-96 flex flex-col p-4">
        <div
          onClick={() => {
            chrome.storage.sync.clear();
          }}>
          reset
        </div>
        <div className="text-3xl font-bold">Projects</div>

        <div className="flex flex-col pl-2 pr-4 py-4">
          {projects.map((project, index) => {
            return (
              <div key={index + "."} className="flex flex-col">
                <div className="flex gap-2 justify-center items-center">
                  <Label>Name</Label>
                  <Input
                    value={project.name}
                    onChange={(event) => {
                      updateProjectName(index, event.target.value);
                    }}
                  />
                  <Button
                    onClick={() => {
                      removeProject(index);
                    }}
                    className="bg-destructive text-destructive-foreground"
                    size={"icon"}>
                    <Trash />
                  </Button>
                </div>
                <div>
                  <dir className="flex flex-col pl-2 py-4 gap-2 mb-2">
                    {project.rules.map((rule, ruleIndex) => {
                      return (
                        <div
                          key={index + "." + ruleIndex}
                          className="flex items-center gap-2">
                          <Label>Emoji</Label>
                          <Input
                            onChange={(event) => {
                              updateRuleEmoji(
                                index,
                                ruleIndex,
                                event.target.value
                              );
                            }}
                            value={rule.emoji}
                          />
                          <Button
                            onClick={() => {
                              removeRule(index, ruleIndex);
                            }}
                            className="bg-destructive text-destructive-foreground"
                            size={"icon"}>
                            <Trash />
                          </Button>
                        </div>
                      );
                    })}
                    <Button
                      size={"icon"}
                      variant="ghost"
                      onClick={() => {
                        addRule(index);
                      }}>
                      <Plus />
                    </Button>
                  </dir>
                </div>
              </div>
            );
          })}
          <Button
            size={"icon"}
            className="bg-primary text-primary-foreground"
            onClick={() => {
              addProject();
            }}>
            <Plus />
          </Button>
        </div>

        <div className="w-full flex justify-end">
          <Button
            size={"icon"}
            onClick={() => {
              saveConfig();
            }}>
            <Save />
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
