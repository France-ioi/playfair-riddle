import React from "react";
import {connect} from "react-redux";
import update from "immutability-helper";

class AnswerDialog extends React.PureComponent {
  _refAddress = el => {
    this._address = el;
  };

  componentDidMount () {
    // When the component mounts, select the first input box.
    this._address && this._address.focus();
  }

  onAnswerChanged = event => {
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    this.props.dispatch({type: this.props.answerChanged, key, value});
  };

  render () {
    const {answer} = this.props;
    return (
      <div className="playfair-answer-dialog">
        <div className="section">
          <p>
            Entrez ci-dessous les trois parties de votre réponse, puis cliquez
            sur le bouton Soumettre pour connaître le score obtenu.
          </p>
          <p>
            Vous pouvez soumettre plusieurs réponses. La seule limite est que
            vous ne pouvez pas soumettre plus de deux fois en moins d'une
            minute.
          </p>
          <p className="input">
            <label htmlFor="answer-a">{"Adresse : "}</label>
            <input
              type="text"
              id="answer-a"
              value={answer.a}
              name="a"
              onChange={this.onAnswerChanged}
              ref={this._refAddress}
            />
            <span>
              {
                " (le numéro doit être en chiffres ; par exemple : 125 RUE DE LA PAIX)"
              }
            </span>
          </p>
          <p className="input">
            <label htmlFor="answer-n1">{"Nombre 1 : "}</label>
            <input
              type="text"
              id="answer-n1"
              value={answer.n1}
              name="n1"
              onChange={this.onAnswerChanged}
            />
            <span>{" (il doit contenir 2 chiffres)"}</span>
          </p>
          <p className="input">
            <label htmlFor="answer-n2">{"Nombre 2 : "}</label>
            <input
              type="text"
              id="answer-n2"
              value={answer.n2}
              name="n2"
              onChange={this.onAnswerChanged}
            />
            <span>{" (il doit contenir 3 chiffres)"}</span>
          </p>
        </div>
        <div className="section">
          <p>
            Remarque : les différences d'espaces, d'accents, de
            minuscules/majuscules, de W à la place de V ou vice-versa, et de X
            en trop ou manquants sont ignorées lors de la comparaison entre
            l'adresse fournie et celle attendue.
          </p>
          <p>Le score est calculé comme suit :</p>
          <ul>
            <li>vous partez d'un capital de 500 points ;</li>
            <li>
              10 points sont retirés de ce capital pour chaque indice demandé
              avant votre réponse ;
            </li>
            <li>
              si vous avez à la fois la bonne adresse et les deux nombres, votre
              score est égal au capital restant ;
            </li>
            <li>
              si vous n'avez que l'adresse, ou bien que les deux nombres, votre
              score est égal à la moitié du capital restant.
            </li>
          </ul>
          <p>Autres remarques sur les scores :</p>
          <ul>
            <li>
              le score de l'équipe pour un sujet est le meilleur score parmi
              toutes les soumissions ;
            </li>
            <li>
              obtenir un score non nul à l'entraînement permettra à l'équipe
              d'accéder aux sujets en temps limité ;
            </li>
            <li>
              le score du tour est le meilleur score obtenu parmi les trois
              sujets en temps limité
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function answerChangedReducer (state, action) {
  const {key, value} = action;
  return update(state, {answer: {[key]: {$set: value}}});
}

function AnswerSelector (state) {
  const {
    answer,
    actions: {answerChanged}
  } = state;

  return {
    answer,
    answerChanged
  };
}

export default {
  actions: {
    answerChanged: "Answer.Changed"
  },
  actionReducers: {
    answerChanged: answerChangedReducer
  },
  views: {
    AnswerDialog: connect(AnswerSelector)(AnswerDialog)
  }
};
