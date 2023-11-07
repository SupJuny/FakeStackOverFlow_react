import React from 'react';
import Model from '../models/model.js';
import HelperFunction from './HelperFunctions.js';
var model = new Model();
var help = new HelperFunction();

export default class MainQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { questions: model.getAllQstns() },
            unanswer_filter_checked: false,
            tag_check: this.props.tag_sort,
            searched_page: this.props.search_status,
            q_back_color: this.props.q_color,
            t_back_color: this.props.t_color,
            search_value: ''
        }
        this.display_question_content = this.display_question_content.bind(this);
        this.newest_clicked = this.newest_clicked.bind(this);
        this.active_clicked = this.active_clicked.bind(this);
        this.unanswered_clicked = this.unanswered_clicked.bind(this);
        this.searching_by_input = this.searching_by_input.bind(this);
    }

    searching_by_input(e) {
        if (e.key === "Enter") {
            // this.props.input_handler(e.target.value);
            // console.log(e.target.value);
            this.setState({ searched_page: 1, q_back_color: "transparent", search_value: e.target.value });
            this.props.search_handler(e.target.value);
        }
    }

    handleSearchInputChange = (e) => {
        this.setState({ search_value: e.target.value });
    }

    display_question_content(id) {
        this.props.question_content(id);
    }

    newest_clicked = () => {
        let newest_questions = help.newest_sort(this.props.data.questions);
        this.setState({ data: { questions: newest_questions }, unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
    }

    active_clicked = () => {
        let active_questions = help.active_sort(this.props.data.questions, this.props.data.answers);
        this.setState({ data: { questions: active_questions }, unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
    }

    unanswered_clicked = () => {
        let newest_questions = help.newest_sort(this.props.data.questions);
        this.props.data.questions = newest_questions;
        this.setState({ unanswer_filter_checked: true, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
    }

    make_row = (quest, tags_data, question_row) => {
        var tag_row = [];
        for (let j = 0; j < quest.tagIds.length; j++) {
            for (let i = 0; i < tags_data.length; i++) {
                if (quest.tagIds[j] === tags_data[i].tid) {
                    tag_row.push(<p className='quest_tag' key={tags_data[i].tid}>{tags_data[i].name}</p>);
                }
            }
        }

        //console.log(quest);
        question_row.push(
            <div id="main_questions" key={quest.qid}>
                <div id="section1">
                    <p id="quest_num_ans">{quest.ansIds.length} answers</p>
                    <p id="quest_num_view">{quest.views} views</p>
                </div>

                <div id="section2">
                    <p className="quest_title" onClick={() => { this.display_question_content(quest.qid) }}>{quest.title}</p>
                    <div id="quest_tags">
                        {tag_row}
                    </div>
                </div>

                <div id="section3">
                    <p id="quest_user">{quest.askedBy} </p>
                    <p id="quest_asked"> asked</p>
                    <p id="quest_time">{help.time_log(quest.askDate)}</p>
                </div>
            </div>
        )
    }

    render() {
        var question_row = [];
        var tags_data = this.props.data.tags;
        let counter = 0;
        let q_string = 'question';
        //console.log(this.props.data);
        // console.log(tags_data);
        // console.log(ans_data);
        // console.log(this.props.data.questions);
        // console.log(this.state.unanswer_filter_checked);
        // console.log(this.state.tag_check);
        // console.log(this.props.tid);

        if (this.state.unanswer_filter_checked) this.props.data.questions = help.newest_sort(this.props.data.questions);

        if (this.state.searched_page === 1) {
            console.log("passed search == 1")
            this.props.temp_data.questions.forEach((quest) => {
                this.make_row(quest, tags_data, question_row);
                counter++;
            });

            if (counter > 1) q_string = 'questions';
            if (counter < 1) {
                return (
                    <div>
                        <h1 id='title'>Fake Stack Overflow</h1>
                        <input
                            id="search_input"
                            type="text"
                            placeholder="Search..."
                            value={this.state.search_value}
                            onChange={this.handleSearchInputChange}
                            onKeyDown={this.searching_by_input}>
                        </input>

                        <div id='main_left'>
                            <br></br>
                            <br></br>
                            <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
                            }}>Questions</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                        </div>

                        <div id='main_right'>
                            <div>
                                <h2 id='allQ'>Search Results</h2>
                                <button className='askQ' id='askQ_main' onClick={this.props.ask_question}>Ask Question</button>
                            </div>
                            <div id='number_and_sorting_buttons'>
                                <p id='numQ'>{counter + ' ' + q_string}</p>

                                <div id='sorting_btns'>
                                    <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                    <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                    <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                                </div>
                                <br></br>
                            </div>
                            <div id="main_questions_load">
                                <h2 id="no_questions">No Questions Found </h2>
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <h1 id='title'>Fake Stack Overflow</h1>
                        <input
                            id="search_input"
                            type="text"
                            placeholder="Search..."
                            value={this.state.search_value}
                            onChange={this.handleSearchInputChange}
                            onKeyDown={this.searching_by_input}
                        ></input>

                        <div id='main_left'>
                            <br></br>
                            <br></br>
                            <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
                            }}>Questions</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                        </div>

                        <div id='main_right'>
                            <div>
                                <h2 id='allQ'>Search Results</h2>
                                <button className='askQ' id='askQ_main' onClick={this.props.ask_question}>Ask Question</button>
                            </div>
                            <div id='number_and_sorting_buttons'>
                                <p id='numQ'>{counter + ' ' + q_string}</p>

                                <div id='sorting_btns'>
                                    <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                    <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                    <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                                </div>
                                <br></br>
                            </div>
                            <div id="main_questions_load">
                                {question_row}
                            </div>
                        </div>
                    </div>
                );
            }
        }
        else {
            if (this.state.tag_check) {
                this.props.data.questions.forEach((quest) => {
                    if (quest.tagIds.includes(this.props.tid)) {
                        this.make_row(quest, tags_data, question_row);
                        counter++;
                    }
                })
            }
            else {

                this.props.data.questions.forEach((quest) => {
                    if (this.state.unanswer_filter_checked) {
                        if (quest.ansIds.length < 1) {
                            this.make_row(quest, tags_data, question_row);
                            counter++;
                        }
                    }
                    else {
                        console.log("make_row execute");
                        this.make_row(quest, tags_data, question_row);
                        counter++;
                    }

                });
            }

            if (counter > 1) q_string = 'questions';

            return (
                <div>
                    <h1 id='title'>Fake Stack Overflow</h1>
                    <input
                        id="search_input"
                        type="text"
                        placeholder="Search..."
                        value={this.state.search_value}
                        onChange={this.handleSearchInputChange}
                        onKeyDown={this.searching_by_input}>
                    </input>

                    <div id='main_left'>
                        <br></br>
                        <br></br>
                        <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                            e.preventDefault();
                            this.setState({ unanswer_filter_checked: false, tag_check: false, q_back_color: "lightgray", search_value: '' });
                        }}>Questions</button>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                    </div>

                    <div id='main_right'>
                        <div>
                            <h2 id='allQ'>All Questions</h2>
                            <button className='askQ' id='askQ_main' onClick={this.props.ask_question}>Ask Question</button>
                        </div>
                        <div id='number_and_sorting_buttons'>
                            <p id='numQ'>{counter + ' ' + q_string}</p>

                            <div id='sorting_btns'>
                                <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                            </div>
                            <br></br>
                        </div>
                        <div id="main_questions_load">
                            {question_row}
                        </div>
                    </div>
                </div>
            );
        }
    }
}