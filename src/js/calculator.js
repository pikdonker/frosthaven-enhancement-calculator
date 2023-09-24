import React, { Component } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import GloomhavenIcon from './gloomhavenIcon';

const iconWidth = "16px";

const playerPlusOneAbilityLines = {
  move: { cost: 30, title: "Move", icon: "generalMove" },
  attack: { cost: 50, title: "Attack", icon: "generalAttack" },
  range: { cost: 30, title: "Range", icon: "generalRange" },
  target: { cost: 75, title: "Target", icon: "generalTarget" },
  shield: { cost: 80, title: "Shield", icon: "generalShield" },
  retaliate: { cost: 60, title: "Retaliate", icon: "generalRetaliate" },
  pierce: { cost: 30, title: "Pierce", icon: "statusEffectPierce" },
  heal: { cost: 30, title: "Heal", icon: "generalHeal" },
  push: { cost: 30, title: "Push", icon: "statusEffectPush" },
  pull: { cost: 20, title: "Pull", icon: "statusEffectPull" },
  teleport: { cost: 50, title: "Teleport", icon: "generalTeleport" },
};

const summonPlusOneAbilityLines = {
  hp: { cost: 40, title: "HP", icon: "generalHeal" },
  move: { cost: 60, title: "Move", icon: "generalMove" },
  attack: { cost: 100, title: "Attack", icon: "generalAttack" },
  range: { cost: 50, title: "Range", icon: "generalRange" },
};

const baseOtherEffects = {
  regenerate: { cost: 40, title: "Regenerate", icon: "statusEffectRegenerate" },
  ward: { cost: 75, title: "Ward", icon: "statusEffectWard" },
  strengthen: { cost: 100, title: "Strengthen", icon: "statusEffectStrengthen" },
  bless: { cost: 75, title: "Bless", icon: "statusEffectBless" },
  wound: { cost: 75, title: "Wound", icon: "statusEffectWound" },
  poison: { cost: 50, title: "Poison", icon: "statusEffectPoison" },
  immobilize: { cost: 150, title: "Immobilize", icon: "statusEffectImmobilize" },
  muddle: { cost: 40, title: "Muddle", icon: "statusEffectMuddle" },
  curse: { cost: 150, title: "Curse", icon: "statusEffectCurse" },
  specificElement: { cost: 100, title: "Specific Element", icon: "elementFire" },
  wildElement: { cost: 150, title: "Wild Element", icon: "elementAll" },
  jump: { cost: 60, title: "Jump", icon: "generalJump" },
};

const stickerTypes = {
  playerPlus1: { title: "Player" },
  summonPlus1: { title: "Summon" },
  attackHex: { title: "Attack Hex" },
  otherEffect: { title: "Other Effect" },
};

const levelCost = [0, 25, 50, 75, 100, 125, 150, 175, 200];
const previousEnhancementCost = [0, 75, 150, 225, 300];

class EnhancementCalculatorComponent extends Component {

  constructor() {
    super();

    this.state = {
      EnhancementLvl: 1,
      stickerType: "", // +1 / summon +1 / attack hex / else
      playerPlusOneAbility: "",
      baseOtherEffect: "",
      summonPlusOneAbility: "",
      numberOfCurrentlyTargetedHexes: 2,
      levelOfAbilityCard: 1,
      numberOfPreviousEnhancements: 0,
      multipleTargets: false,
      lostCard: false,
      persistentBonus: false,
    }
  }

  doubleMultipleTargets() {
    if (this.state.stickerType === "attackHex") {
      return false;
    }

    if (this.state.baseOtherEffect === 'specificElement') {
      return false;
    }

    if (this.state.baseOtherEffect === 'wildElement') {
      return false;
    }

    if (this.state.playerPlusOneAbility === 'target') {
      return false;
    }

    return true;
  }

  calculateCost() {
    let cost = 0;

    if (this.state.stickerType === "playerPlus1") {
      if (this.state.playerPlusOneAbility) {
        cost += playerPlusOneAbilityLines[this.state.playerPlusOneAbility].cost;
      }
      else {
        // cannot yet calculate
        return 0;
      }
    }
    else if (this.state.stickerType === "summonPlus1") {
      if (this.state.summonPlusOneAbility) {
        cost += summonPlusOneAbilityLines[this.state.summonPlusOneAbility].cost;
      }
      else {
        // cannot yet calculate
        return 0;
      }
    }
    else if (this.state.stickerType === "attackHex") {
      cost += Math.ceil( 200 / this.state.numberOfCurrentlyTargetedHexes );
    }
    else if (this.state.stickerType === "otherEffect") {
      if (this.state.baseOtherEffect) {
        cost += baseOtherEffects[this.state.baseOtherEffect].cost;
      }
      else {
        // cannot yet calculate
        return 0;
      }
    }
    else {
      // no legal option selected
      return 0;
    }

    // If enchancement building is build to this lvl
    if(EnhancementLvl >= 2 && cost > 0)
    {
      cost -= 10
    }
    // double BASE COST if multiple targets (does not apply for attack hex)
    if (this.state.multipleTargets && this.doubleMultipleTargets()) {
      cost *= 2;
    }

    // halve BASE COST if lost
    if (this.state.lostCard) {
      cost /= 2;
    }

    // triple BASE COST if persistent bonus
    if (this.state.persistentBonus && this.state.stickerType !== "summonPlus1") {
      cost *= 3;
    }

    // extra cost for level of ability card
    // If enchancement building is build to this lvl
    var LevelOfCardMod = levelCost[this.state.levelOfAbilityCard - 1];
    if(EnhancementLvl >= 3 && cost > 0)
    {
      cost += ((this.state.levelOfAbilityCard * 10) - LevelOfCardMod);
    }
    else
    {
      cost += LevelOfCardMod;
    }


    // extra cost for previous enhancements to the same action
    // If enchancement building is build to this lvl
    var PrevOfCardMod = previousEnhancementCost[this.state.numberOfPreviousEnhancements];
    if(EnhancementLvl >= 4 && cost > 0)
    {
      cost += ((this.state.numberOfPreviousEnhancements * 25) - PrevOfCardMod);
    }
    else{
      cost += PrevOfCardMod;
    }

    return cost;
  }

  stickerTypeClick(stickerType) {
    if (this.state.stickerType === stickerType) {
      this.setState({
        stickerType: ""
      });
    }
    else {
      this.setState({
        stickerType: stickerType
      });      
    }
  }

  summonPlusOneAbilityClick(effect) {
    if (this.state.summonPlusOneAbility === effect) {
      this.setState({
        summonPlusOneAbility: ""
      });
    }
    else {
      this.setState({
        summonPlusOneAbility: effect
      });  
    }
  }

  baseOtherEffectClick(effect) {
    if (this.state.baseOtherEffect === effect) {
      this.setState({
        baseOtherEffect: ""
      });
    }
    else {
      this.setState({
        baseOtherEffect: effect
      });  
    }
  }

  playerPlusOneAbilityClick(abilityLine) {
    if (this.state.playerPlusOneAbility === abilityLine) {
      this.setState({
        playerPlusOneAbility: ""
      });
    }
    else {
      this.setState({
        playerPlusOneAbility: abilityLine
      });  
    }
  }

  levelClick(level) {
    this.setState({
      levelOfAbilityCard: level
    });
  }

  numberOfHexesClick(hexes) {
    this.setState({
      numberOfCurrentlyTargetedHexes: hexes
    });
  }

  previousEnhancementClick(number) {
    this.setState({
      numberOfPreviousEnhancements: number
    });
  }

  multipleTargetClick() {
    this.setState({
      multipleTargets: !this.state.multipleTargets
    }); 
  }

  persistentBonusClick() {
    this.setState({
      persistentBonus: !this.state.persistentBonus
    }); 
  }

  lostCardClick() {
    this.setState({
      lostCard: !this.state.lostCard
    }); 
  }

  showOtherOptions() {
    if (this.state.stickerType === "playerPlus1") {
      if (this.state.playerPlusOneAbility) {
        return true;
      }
    }
    else if (this.state.stickerType === "summonPlus1") {
      if (this.state.summonPlusOneAbility) {
        return true;
      }
    }
    else if (this.state.stickerType === "attackHex") {
      return true;
    }
    else if (this.state.stickerType === "otherEffect") {
      if (this.state.baseOtherEffect) {
        return true;
      }
    }

    return false;
  }

  makeBadgeRow(text) {
    return (
      <Row>
        <Col xs={12} md={12} className="text-center instruction-label">
          {text}
        </Col>
      </Row>
    );
  }

  render() {
    let cost = this.calculateCost();

    let enhancementTypeColumns = [];
    let playerPlusOneAbilityColumns = [];
    let baseOtherEffectColumns = [];
    let summonPlusOneAbilityColumns = [];
    let abilityCardLevelColumns = [];
    let previousEnhancementsColumns = [];
    let numberOfHexesColumns = [];

    for (let i=2; i<=13; i++) {
      numberOfHexesColumns.push(
        <Col className="enhancement-col" key={i} xs={4} md={3}>
          <Button variant="outline-secondary" block onClick={() => this.numberOfHexesClick(i)} className={this.state.numberOfCurrentlyTargetedHexes === i && "active"}>
            {i} <GloomhavenIcon icon="generalAttackHex" width={iconWidth} /> ({Math.ceil( 200 / i )}g)
          </Button>
        </Col>
      );
    }

    for (let i=0; i<=3; i++) {
      previousEnhancementsColumns.push(
        <Col className="enhancement-col" key={i} xs={6} md={3}>
          <Button variant="outline-secondary" block onClick={() => this.previousEnhancementClick(i)} className={this.state.numberOfPreviousEnhancements === i && "active"}>
            {i} (+{previousEnhancementCost[i]}g)
          </Button>
        </Col>
      );
    }

    for (let i=1; i<=9; i++) {
      abilityCardLevelColumns.push(
        <Col className="enhancement-col" key={i} xs={4} md={2} lg={1} xl={true}>
          <Button variant="outline-secondary" block onClick={() => this.levelClick(i)} className={this.state.levelOfAbilityCard === i && "active"}>
            {i} (+{levelCost[i-1]}g)
          </Button>
        </Col>
      );
    }

    for (let stickerType in stickerTypes) {
      if (stickerTypes.hasOwnProperty(stickerType)) {
        let type = stickerTypes[stickerType];
        
        let icons = "";
        if (stickerType === "attackHex") {
          icons = <GloomhavenIcon icon="generalAttackHex" width={iconWidth} />
        }
        else if (stickerType === "otherEffect") {
          icons = (
            <span>
              <GloomhavenIcon icon="elementFire" width={iconWidth} /> 
              <GloomhavenIcon icon="generalJump" width={iconWidth} /> 
              <GloomhavenIcon icon="statusEffectMuddle" width={iconWidth} />
            </span>
          )
        }
        else {
          icons = <GloomhavenIcon icon="generalPlusOne" width={iconWidth} />
        }

        enhancementTypeColumns.push(
          <Col className="enhancement-col" key={stickerType} xs={6} md={3}>
            <Button variant="outline-secondary" block onClick={() => this.stickerTypeClick(stickerType)} className={this.state.stickerType === stickerType && "active"}>
              {type.title} {icons}
            </Button>
          </Col>
        );
      }
    }

    for (let baseOtherEffect in baseOtherEffects) {
      if (baseOtherEffects.hasOwnProperty(baseOtherEffect)) {
        let effect = baseOtherEffects[baseOtherEffect];
        
        let xs = 6;
        let md = 3;
        if (baseOtherEffect === "specificElement" || baseOtherEffect === "wildElement" || baseOtherEffect === "jump") {
          xs = 12;
        }

        if (baseOtherEffect === "specificElement") {
          md = 6;
        }

        let icons = <GloomhavenIcon icon={effect.icon} width={iconWidth} />
        if (baseOtherEffect === "specificElement") {
          icons = (
            <span>
              <GloomhavenIcon icon="elementAir" width={iconWidth} /> 
              <GloomhavenIcon icon="elementLight" width={iconWidth} /> 
              <GloomhavenIcon icon="elementIce" width={iconWidth} /> 
              <GloomhavenIcon icon="elementDark" width={iconWidth} /> 
              <GloomhavenIcon icon="elementFire" width={iconWidth} /> 
              <GloomhavenIcon icon="elementEarth" width={iconWidth} /> 
            </span>
          )
        }

        baseOtherEffectColumns.push(
          <Col className="enhancement-col" key={baseOtherEffect} xs={xs} md={md}>
            <Button variant="outline-secondary" block onClick={() => this.baseOtherEffectClick(baseOtherEffect)} className={this.state.baseOtherEffect === baseOtherEffect && "active"}>
              {effect.title} {icons} ({effect.cost}g)
            </Button>
          </Col>
        );
      }
    }

    for (let playerPlusOneAbilityLine in playerPlusOneAbilityLines) {
      if (playerPlusOneAbilityLines.hasOwnProperty(playerPlusOneAbilityLine)) {
        let ability = playerPlusOneAbilityLines[playerPlusOneAbilityLine];

        playerPlusOneAbilityColumns.push(
          <Col className="enhancement-col" key={playerPlusOneAbilityLine} xs={6} md={2}>
            <Button variant="outline-secondary" block onClick={() => this.playerPlusOneAbilityClick(playerPlusOneAbilityLine)} className={this.state.playerPlusOneAbility === playerPlusOneAbilityLine && "active"}>
              {ability.title} <GloomhavenIcon icon={ability.icon} width={iconWidth} /> ({ability.cost}g)
            </Button>
          </Col>
        );
      }
    }

    for (let summonPlusOneAbilityLine in summonPlusOneAbilityLines) {
      if (summonPlusOneAbilityLines.hasOwnProperty(summonPlusOneAbilityLine)) {
        let ability = summonPlusOneAbilityLines[summonPlusOneAbilityLine];

        summonPlusOneAbilityColumns.push(
          <Col className="enhancement-col" key={summonPlusOneAbilityLine} xs={6} md={3}>
            <Button variant="outline-secondary" block onClick={() => this.summonPlusOneAbilityClick(summonPlusOneAbilityLine)} className={this.state.summonPlusOneAbility === summonPlusOneAbilityLine && "active"}>
              {ability.title} <GloomhavenIcon icon={ability.icon} width={iconWidth} /> ({ability.cost}g)
            </Button>
          </Col>
        );
      }
    }

    return (
      <div className="container">
      	<Container className="enhancement-container">
          <Row className="hidden-xs">
            <Col xs={12} md={12}>
              <blockquote>
                <p>Adapted from: <a href="https://ninjawithkillmoon.github.io/utilities/enhancementCalculator">The Arcane Library - Enhancement Calculator</a>. <a href="https://github.com/pikdonker/frosthaven-enhancement-calculator">Source</a></p>
                <p>Each type of enhancement has a base cost. The cost might then be modified based on which ability is being enhanced.</p>
                <p>asf Some enhancements do not fall neatly into the categories on the cost chart. When determining their base cost, treat damage traps as "<img alt="Attack Icon" src="./images/fh-attack-bw-icon.png" width={"12px"} /> +1" enhancements (50 gold), treat healing traps as "<img alt="Heal Icon" src="./images/fh-heal-bw-icon.png" width={"12px"} /> +1" enhancements (30 gold), and treat the movement of tokens and tiles as "<img alt="Move Icon" src="./images/fh-move-bw-icon.png" width={"12px"} /> +1" enhancements (30 gold).</p>
              </blockquote>
              <select value={this.state.EnhancementLvl}>
                <option value="1" >Building Lvl 1</option>
                <option value="2" >Building Lvl 2</option>
                <option value="3" >Building Lvl 3</option>
                <option value="4" >Building Lvl 4</option>
              </select>
            </Col>
          </Row>

          {this.makeBadgeRow("Enhancement Type")}

          <Row>
            {enhancementTypeColumns}
          </Row>

          {this.state.stickerType === "playerPlus1" && 
            <div>
              <hr />
              {this.makeBadgeRow("Ability Line")}
              <Row>
                {playerPlusOneAbilityColumns}
              </Row>
            </div>
          }

          {this.state.stickerType === "summonPlus1" && 
            <div>
              <hr />
              {this.makeBadgeRow("Enhancement Effect")}
              <Row>
                {summonPlusOneAbilityColumns}
              </Row>
            </div>
          }

          {this.state.stickerType === "attackHex" && 
            <div>
              <hr />
              {this.makeBadgeRow("Number of Hexes Currently Targeted with the Attack")}
              <Row>
                {numberOfHexesColumns}
              </Row>
            </div>
          }

          {this.state.stickerType === "otherEffect" && 
            <div>
              <hr />
              {this.makeBadgeRow("Base Effect")}
              <Row>
                {baseOtherEffectColumns}
              </Row>
            </div>
          }

          {this.showOtherOptions() && 
            <div>
              <hr />
              {this.makeBadgeRow("Level of Ability Card")}
              <Row>
                {abilityCardLevelColumns}
              </Row>
            </div>
          }

          {this.showOtherOptions() && 
            <div>
              <hr />
              {this.makeBadgeRow("Number of Previous Enhancements to the Same Action")}
              <Row>
                {previousEnhancementsColumns}
              </Row>
            </div>
          }

          {this.showOtherOptions() && this.doubleMultipleTargets() &&
            <div>
              <hr />
              {this.makeBadgeRow("Ability has Multiple Targets/Summons/Tokens")}
              <Row>
                <Col className="enhancement-col" xs={12} md={12}>
                  <Button variant="outline-secondary" disabled={!this.doubleMultipleTargets()} block onClick={() => this.multipleTargetClick()} className={this.state.multipleTargets && "active"}>{this.state.multipleTargets ? "Yes (Double base cost)" : "No"}</Button>
                </Col>
              </Row>
            </div>
          }

          {this.showOtherOptions() && 
            <div>
              <hr />
              <Row>
                <Col xs={12} md={12} className="text-center instruction-label">
                  Ability has a Lost <GloomhavenIcon icon="generalLost" width={iconWidth} /> Icon, but no Persistent <GloomhavenIcon icon="generalPersistent" width={iconWidth} /> Icon
                </Col>
              </Row>
              <Row>
                <Col className="enhancement-col" xs={12} md={12}>
                  <Button variant="outline-secondary" block onClick={() => this.lostCardClick()} className={this.state.lostCard && "active"}>{this.state.lostCard ? "Yes (Halve base cost)" : "No"}</Button>
                </Col>
              </Row>
            </div>
          }

          {this.showOtherOptions() && this.state.stickerType !== "summonPlus1" &&
            <div>
              <hr />
              <Row>
                <Col xs={12} md={12} className="text-center instruction-label">
                Ability has a Persistent <GloomhavenIcon icon="generalPersistent" width={iconWidth} /> Icon
                </Col>
              </Row>
              <Row>
                <Col className="enhancement-col" xs={12} md={12}>
                  <Button variant="outline-secondary" block onClick={() => this.persistentBonusClick()} className={this.state.persistentBonus && "active"}>{this.state.persistentBonus ? "Yes (Triple base cost)" : "No"}</Button>
                </Col>
              </Row>
            </div>
          }

          <hr />
          {this.makeBadgeRow("Enhancement Cost")}
          <Row className="cost-row">
            <Col className="enhancement-col text-center" xs={12} md={12}>
              {cost <= 0 &&
                <Badge className="badge-xxlarge badge-primary">-</Badge>
              }
              {cost > 0 &&
                <Badge className="badge-xxlarge badge-primary">{cost + " gold"}</Badge>
              }
            </Col>
          </Row>
      	</Container>
      </div>
    );
  }
}

export default EnhancementCalculatorComponent;