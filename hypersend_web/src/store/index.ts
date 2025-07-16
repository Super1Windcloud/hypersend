import {defineStore} from "pinia";
import {getRandomNumber} from "@/utils";
import {ElNotification} from "element-plus";

/// Map ,Set 不能作为 响应式数据 ,  使用 对象数组而不是 嵌套对象
type SubjectObj = {
    uuid: string;
    questions: string;
    answers: string;
    headers: string;
}
export const useSubject =
    defineStore('questions',
        {
            state: () => {
                return {
                    subjects: [] as SubjectObj[]
                }
            },
            getters: {
                // getter 不能使用 $State, getter是计算属性类型不需要()调用
                getSubjectCount(): number {
                    return this.subjects.length;
                },
                getLastElement(): SubjectObj {
                    if (this.subjects.length === 0) {
                        throw new Error('subjects 数组为空，无法获取最后一个元素');
                    }
                    return this.subjects[this.subjects.length - 1];
                }
                , getFirstElement(): SubjectObj {
                    return this.subjects[0];
                },
                // getter 属于内部属性 ,不能够接受参数
                getLastuuid(): string {
                    if (this.subjects.length === 0) {
                        throw new Error('subjects 数组为空，无法获取最后一个元素');
                    }
                    return this.subjects[this.subjects.length - 1].uuid;
                },
                getLastAnswer(): string {
                    if (this.subjects.length === 0) {
                        return "No Answer";
                    }
                    return this.subjects[this.subjects.length - 1].answers;
                },

            },
            actions: {
                addSubject(content ?: string, answer ?: string) {
                    if (!content || !answer) return;
                    let uuid = getRandomNumber();
                    this.$state.subjects.push({
                        uuid: uuid,
                        questions: content,
                        answers: answer,
                        headers: content
                    });
                },
                addHeaders(header  ?: string) {
                    if (!header) return;
                },
                addAnswers(answer ?: string) {
                    if (!answer) return;
                },
                clearSubject() {
                    this.$state.subjects = [];
                    this.$reset();
                },
                updateSpecificAnswer(uuid: string, answer: string) {
                    for (let i = 0; i < this.subjects.length; i++) {
                        if (this.subjects[i].uuid === uuid) {
                            this.subjects[i].answers = answer;
                            break;
                        }
                    }
                },
                updateLastAnswer(answer: string) {
                    if (this.getSubjectCount === 0) return Error("no Subject to update ");
                    this.subjects[this.subjects.length - 1].answers = answer;
                },
                getSpecificElement(uuid: string): SubjectObj {
                    return this.subjects.find
                    ((item) =>
                        item.uuid === uuid) as SubjectObj;
                }
                , deleteTopSubject() {
                    let _ = this.subjects.shift();
                }, deleteLastSubject() {
                    let _ = this.subjects.pop();
                }

            }
        }
    );

export const usePrompts = defineStore('prompts', {
    state: () => {
        return {
            prompts: "" as string
        }
    },
    actions: {
        renderDefaultPrompts(): void {
            let code = useProgramLanguage();
            let result = "you  are a helpful code assistant  for  solving my algorithms questions, please use " + code.language;
            this.$state.prompts = result;
        }
        , renderCustomPrompts() {
            if (!this.prompts) return;
            let template = `这是Prompt :${this.prompts}`;
            this.prompts = template;
            ElNotification({
                title: '自定义的Prompts',
                message: this.$state.prompts || "prompts 为空",
                type: 'success',
                position: 'bottom-left'
                , offset: 200
            })
        }
    }, getters: {
        getPrompts(): string {
            return this.prompts;
        }
    }
});


export const useProgramLanguage = defineStore('programLanguage',
    {
        state: () => {
            return {
                language: "" as string
            }
        },
    }
);

export const useLLMModel = defineStore('llmModel', {
    state: () => {
        return {
            model: "" as string
        }
    },
});

export const useShowQuestion = defineStore("autoCapture", {
    state: () => ({isShowQuestion: true})
});


export const useWebSocketStatus = defineStore('webSocketStatus', {
    state: () => ({isConnection: false})
});