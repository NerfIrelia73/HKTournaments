import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';
import { Tournament } from '../shared/services/tournament';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {

  constructor(public authService: AuthService, public lazyDialog: LazyDialogService) {
  }

  tournaments: Tournament[] = []

  isSiteAdmin = false

  ngOnInit() {
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
      //console.log(this.tournaments)
    })
    this.authService.usersInfo.forEach((info) => {
      if (info != null && info.siteAdmin != null) {
        this.isSiteAdmin = info.siteAdmin
      }
    })
  }

  createTournament() {
    const config = {
      data: {
        choice: "create"
      },
      position: {
        top: '4%'
      },
      maxHeight: '85vh',
    }
    this.lazyDialog.openDialog('tournament-screen', config)
  }

  editTournament(name: string, description: string, id: string, admins: string[], deadline: any) {
    const config = {
      data: {
        choice: "edit",
        name: name,
        description: description,
        id: id,
        admins: admins,
        deadline: deadline ? deadline.toDate() : ""
      },
      position: {
        top: '4%'
      },
      maxHeight: '85vh',
    }
    this.lazyDialog.openDialog('tournament-screen', config)
  }

  deleteTournament(name: string, id: string) {
    const config = {
      data: {
        text: `Are you sure you would like to delete \"${name}\"`,
        choice: "tournament",
        tournamentId: id,
      },
      position: {
        top: '18%'
      }
    }
    this.lazyDialog.openDialog('confirm-screen', config)
  }

}
