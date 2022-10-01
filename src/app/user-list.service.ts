import { Injectable } from '@angular/core';
import { User } from './shared/services/user';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor() { }

  userList: User[] = []

  addToList(user: User) {
    this.userList.push(user)
  }

  getUserList() {
    return this.userList
  }
}
