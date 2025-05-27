export interface Participant {
  uid: string;
  displayName: string;
  seed: number; // Add this to ensure sorting by seed
}

export class DoubleEliminationManager {
  participants: Participant[] = [];
  bracketSize: number = -1;
  winnersBracketRounds: any[][] = [];
  losersBracketRounds: any[][] = [];
  matchIdCounter: number;

  constructor() {
    this.matchIdCounter = 1;
  }

  // Generate winners bracket first round matches with byes assigned
  private generateWinnersFirstRound(): any {
    function generateBracketOrder(size: number): number[] {
        if (size === 1) return [1];

        const prevSeeds = generateBracketOrder(size / 2);
        const newSeeds: number[] = [];

        for (let i = 0; i < prevSeeds.length; i++) {
        newSeeds.push(prevSeeds[i]);
        newSeeds.push(size + 1 - prevSeeds[i]);
        }

        return newSeeds;
    }

    const totalSlots = Math.pow(2, Math.ceil(Math.log2(this.participants.length)));
    const seedingOrder = generateBracketOrder(totalSlots);

    const sorted = [...this.participants]
    const slots = Array(totalSlots).fill(null);

    for (let i = 0; i < sorted.length; i++) {
        const positionIndex = seedingOrder.indexOf(i + 1);
        slots[positionIndex] = sorted[i];
    }

    const round = []

    for (let i = 0; i < slots.length - 1; i++) {
        round.push({
            childIndex: i / 4,
            opponent1: slots[i],
            opponent2: slots[i + 1] == null ? -1 : slots[i + 1],
            result: slots[i + 1] == null ? 1 : 0,
            tmpOpponent1: "",
            tmpOpponent2: ""
        })
        i++
    }

    return round;
  }

  // Generates the rest of the bracket rounds (simplified version)
  private generateWinnersBracket() {
    let num = this.bracketSize / 2
    this.winnersBracketRounds = [];
    this.winnersBracketRounds.push(this.generateWinnersFirstRound());

    let r = 0
    while (num > 1) {
        const round = []
        for (let i = 0; i < num - 1; i++) {
            const roundMatch: any = {
                childIndex: i / 4,
                opponent1: null,
                opponent2: null,
                result: 0,
                tmpOpponent1: "",
                tmpOpponent2: ""
            }
            if (r == 0) {
                if (this.winnersBracketRounds[r][i].opponent1 != null && this.winnersBracketRounds[r][i].opponent2 == null) {
                    roundMatch.opponent1 = this.winnersBracketRounds[r][i].opponent1
                } else if (this.winnersBracketRounds[r][i].opponent1 == null && this.winnersBracketRounds[r][i].opponent2 != null) {
                    roundMatch.opponent1 = this.winnersBracketRounds[r][i].opponent2
                }
                if (this.winnersBracketRounds[r][i + 1].opponent1 != null && this.winnersBracketRounds[r][i + 1].opponent2 == null) {
                    roundMatch.opponent2 = this.winnersBracketRounds[r][i + 1].opponent1
                } else if (this.winnersBracketRounds[r][i + 1].opponent1 == null && this.winnersBracketRounds[r][i + 1].opponent2 != null) {
                    roundMatch.opponent2 = this.winnersBracketRounds[r][i + 1].opponent2
                }
            }
            round.push(roundMatch)
            i++
        }
        num = num / 2
        this.winnersBracketRounds.push(round)
        r++
    }
    this.winnersBracketRounds.push([{
      childIndex: 0,
      opponent1: null,
      opponent2: null,
      result: 0,
      tmpOpponent1: "",
      tmpOpponent2: ""
    }])
  }

  generateBrackets() {
    this.generateWinnersBracket()
    this.generateLosersBracket()
    for (let i = 0; i < this.winnersBracketRounds[0].length; i++) {
      this.reportMatchResult('winners', i, 0, this.winnersBracketRounds[0][i].result, this.winnersBracketRounds[0][i])
    }
    this.updateFutureOpponents()
  }

  getWinnersRounds(): any[][] {
    return this.winnersBracketRounds;
  }

  getLosersRounds(): any[][] {
    return this.losersBracketRounds;
  }

  private generateLosersBracket() {
    const numParticipants = this.participants.length;
    const numWinnersRounds = Math.ceil(Math.log2(numParticipants));
    const numLosersRounds = numWinnersRounds * 2 - 1;

    this.losersBracketRounds = [];

    // Number of matches per Losers round:
    const losersMatchesPerRound: number[] = [];

    // Calculate number of matches per round
    for (let round = 0; round < numLosersRounds; round++) {
      if (round % 2 === 0) {
        // Even rounds: ceil(activePlayers / 2)
        const matches = Math.pow(2, numWinnersRounds - Math.ceil((round + 2) / 2)) / 2;
        losersMatchesPerRound.push(matches);
      } else {
        // Odd rounds: half as many as previous Winners round
        const matches = Math.pow(2, numWinnersRounds - Math.ceil((round + 1) / 2)) / 2;
        losersMatchesPerRound.push(matches);
      }
    }

    // Now, generate empty matches for each round
    for (let round = 0; round < numLosersRounds; round++) {
      const numMatches = losersMatchesPerRound[round];
      const numNextMatches = losersMatchesPerRound[round + 1] != null ? losersMatchesPerRound[round + 1] : losersMatchesPerRound[round]
      const roundMatches: any[] = [];

      for (let i = 0; i < numMatches; i++) {
        roundMatches.push({
          childIndex: i / (numMatches / numNextMatches),
          opponent1: null,
          opponent2: null,
          result: 0,
          tmpOpponent1: "",
          tmpOpponent2: "",
        });
      }

      this.losersBracketRounds.push(roundMatches);
    }
    this.losersBracketRounds.pop()
    this.setLosersDrops()
    this.updateLosersFirstRound()
  }

  private updateLosersFirstRound(): any {
    let splicedRounds = []
    const winnersRound1 = JSON.parse(JSON.stringify(this.winnersBracketRounds[0]))
    while (winnersRound1.length > 0) {
      splicedRounds.push(winnersRound1.splice(0,4))
    }

    if (splicedRounds.length > 1) {
      for (let i = 0; i < splicedRounds.length; i+=2) {
        const tmp: any = splicedRounds[i]
        splicedRounds[i] = splicedRounds[i + 1]
        splicedRounds[i + 1] = tmp
      }
    }

    splicedRounds = splicedRounds.flat()

    for (let i = 0; i < splicedRounds.length; i+=2) {
      const m1data = this.winnersBracketRounds[0][i]
      const m2data = this.winnersBracketRounds[0][i + 1]
      if (m1data.result != 0) {
        this.losersBracketRounds[0][i / 2].opponent1 = m1data.result == 1 ? m1data.opponent2 : m1data.result == 2 ? m1data.opponent1 : -1
      }
      if (m2data.result != 0) {
        this.losersBracketRounds[0][i / 2].opponent2 = m2data.result == 1 ? m2data.opponent2 : m2data.result == 2 ? m1data.opponent1 : -1
      }
      this.winnersBracketRounds[0][i].losersRound = 0
      this.winnersBracketRounds[0][i].losersMatch = i / 2
      this.winnersBracketRounds[0][i].losersIndex = 0
      this.winnersBracketRounds[0][i + 1].losersRound = 0
      this.winnersBracketRounds[0][i + 1].losersMatch = i / 2
      this.winnersBracketRounds[0][i + 1].losersIndex = 0.5
    }
  }

  updateFutureOpponents() {
    for (const [roundIndex, round] of this.winnersBracketRounds.entries()) {
      for (const [matchIndex, match] of round.entries()) {
        if (Math.floor(match.childIndex) == match.childIndex && roundIndex + 1 != this.winnersBracketRounds.length) {
          this.winnersBracketRounds[roundIndex + 1][Math.floor(match.childIndex)].tmpOpponent1 = `Winner of WB ${roundIndex + 1}.${matchIndex + 1}`
        } else if (roundIndex + 1 != this.winnersBracketRounds.length) {
          this.winnersBracketRounds[roundIndex + 1][Math.floor(match.childIndex)].tmpOpponent2 = `Winner of WB ${roundIndex + 1}.${matchIndex + 1}`
        }
        if (Math.floor(match.losersIndex) == match.losersIndex && this.losersBracketRounds[match.losersRound] != null) {
          this.losersBracketRounds[match.losersRound][match.losersMatch].tmpOpponent1 = `Loser of WB ${roundIndex + 1}.${matchIndex + 1}`
        } else if (this.losersBracketRounds[match.losersRound] != null) {
          this.losersBracketRounds[match.losersRound][match.losersMatch].tmpOpponent2 = `Loser of WB ${roundIndex + 1}.${matchIndex + 1}`
        }
      }
    }
    for (const [roundIndex, round] of this.losersBracketRounds.entries()) {
      for (const [matchIndex, match] of round.entries()) {
        if (Math.floor(match.childIndex) == match.childIndex && roundIndex % 2 != 0 && roundIndex + 1 != this.losersBracketRounds.length) {
          this.losersBracketRounds[roundIndex + 1][Math.floor(match.childIndex)].tmpOpponent1 = `Winner of LB ${roundIndex + 1}.${matchIndex + 1}`
        } else if (roundIndex + 1 != this.losersBracketRounds.length) {
          this.losersBracketRounds[roundIndex + 1][Math.floor(match.childIndex)].tmpOpponent2 = `Winner of LB ${roundIndex + 1}.${matchIndex + 1}`
        }
      }
    }
    this.winnersBracketRounds[this.winnersBracketRounds.length - 1][0].tmpOpponent2 = `Winner of LB ${this.losersBracketRounds.length}.1`
  }

  private setLosersDrops() {
    this.winnersBracketRounds.forEach((round, roundIndex) => {
      const numMatches = round.length;

      round.forEach((match, matchIndex) => {
        let losersRound, losersMatch;
        losersRound = (roundIndex * 2) - 1;
        if (roundIndex === 0) {
          // Winners R1 → Losers R1 (snake)
          losersRound = 0;
          const numLosersMatches = this.losersBracketRounds[losersRound].length;
          if (matchIndex % 2 === 0) {
            losersMatch = matchIndex / 2;
          } else {
            losersMatch = (numLosersMatches - 1) - Math.floor(matchIndex / 2);
          }

        } else if (roundIndex === 1) {
          // Winners R2 → Losers R2 (reverse)
          losersMatch = (numMatches - 1) - matchIndex;

        } else if (roundIndex === 2) {
          // Winners R3 → Losers R4 (mirrored halves)
          losersMatch = this.mapWinnersR3toLosersR4(numMatches, matchIndex);

        } else if (roundIndex === 3) {
          // Winners R4 → Losers R5 ([2,3,0,1] if 4 matches)
          losersMatch = this.mapWinnersR4toLosersR5(numMatches, matchIndex);

        } else {
          // R5+ Direct Mapping
          if (!this.losersBracketRounds[losersRound]) {
            losersRound--;
          }
          losersMatch = matchIndex;
        }

        match.losersRound = losersRound;
        match.losersMatch = losersMatch;
        match.losersIndex = 0;
      });
    });
  }

  private mapWinnersR3toLosersR4(numMatches: number, matchIndex: number): number {
    if (numMatches == 1) return 0
    const half = numMatches / 2;
    const mirroredIndex = (matchIndex < half)
      ? (half - 1 - matchIndex)
      : (numMatches - 1 - (matchIndex - half));
    return mirroredIndex;
  }

  private mapWinnersR4toLosersR5(numMatches: number, matchIndex: number): number {
    if (numMatches === 4) {
      const mapping = [2, 3, 0, 1];
      return mapping[matchIndex];
    } else {
      return matchIndex; // direct for others
    }
  }

  reportMatchResult(bracket: string, match: any, round: any, result: any, matchData: any) {
    let winner = result
    if (winner == null) {

    }
    if (parseInt(winner) != 1 && parseInt(winner) != 2) return { winners: this.winnersBracketRounds, losers: this.losersBracketRounds };
    if (bracket == 'winners') {
      this.winnersBracketRounds[round][match].result = parseInt(winner)
      if (round != this.winnersBracketRounds.length - 1) {
        if (Math.floor(matchData.losersIndex) == matchData.losersIndex) {
          this.losersBracketRounds[matchData.losersRound][matchData.losersMatch].opponent1 = parseInt(winner) == 1 ? this.winnersBracketRounds[round][match].opponent2 : this.winnersBracketRounds[round][match].opponent1
        } else {
          this.losersBracketRounds[matchData.losersRound][matchData.losersMatch].opponent2 = parseInt(winner) == 1 ? this.winnersBracketRounds[round][match].opponent2 : this.winnersBracketRounds[round][match].opponent1
        }
        if (Math.floor(this.winnersBracketRounds[round][match].childIndex) == this.winnersBracketRounds[round][match].childIndex) {
          this.winnersBracketRounds[round + 1][Math.floor(this.winnersBracketRounds[round][match].childIndex)].opponent1 = winner == "1" ? this.winnersBracketRounds[round][match].opponent1 : this.winnersBracketRounds[round][match].opponent2
        } else {
          this.winnersBracketRounds[round + 1][Math.floor(this.winnersBracketRounds[round][match].childIndex)].opponent2 = winner == "1" ? this.winnersBracketRounds[round][match].opponent1 : this.winnersBracketRounds[round][match].opponent2
        }
        if (this.losersBracketRounds[matchData.losersRound][matchData.losersMatch].opponent1 == -1 || this.losersBracketRounds[matchData.losersRound][matchData.losersMatch].opponent2 == -1) {
          const result = this.losersBracketRounds[matchData.losersRound][matchData.losersMatch].opponent1 == -1 ? 2 : 1
          this.reportMatchResult('losers', matchData.losersMatch, matchData.losersRound, result, this.losersBracketRounds[matchData.losersRound][matchData.losersMatch])
        }
      }
    } else {
      this.losersBracketRounds[round][match].result = parseInt(winner)
      if (round == this.losersBracketRounds.length - 1) {
        this.winnersBracketRounds[this.winnersBracketRounds.length - 1][0].opponent2 = winner == "1" ? this.losersBracketRounds[round][match].opponent1 : this.losersBracketRounds[round][match].opponent2
      } else {
        if (Math.floor(this.losersBracketRounds[round][match].childIndex) == this.losersBracketRounds[round][match].childIndex && (round + 1) % 2 == 0) {
          this.losersBracketRounds[round + 1][Math.floor(this.losersBracketRounds[round][match].childIndex)].opponent1 = winner == "1" ? this.losersBracketRounds[round][match].opponent1 : this.losersBracketRounds[round][match].opponent2
        } else {
          this.losersBracketRounds[round + 1][Math.floor(this.losersBracketRounds[round][match].childIndex)].opponent2 = winner == "1" ? this.losersBracketRounds[round][match].opponent1 : this.losersBracketRounds[round][match].opponent2
        }
      }
    }
    return { winners: this.winnersBracketRounds, losers: this.losersBracketRounds }
  }

  setWinnersandLosers(winners: any, losers: any, participants: any) {
    this.winnersBracketRounds = winners
    this.losersBracketRounds = losers
    this.participants = participants
    this.bracketSize = Math.pow(2, Math.ceil(Math.log2(this.participants.length)));
  }
}
