// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityManager from '../app/entity/Manager'
import EntityOauth from '../app/entity/Oauth'
import EntityRights from '../app/entity/Rights'
import EntityRole from '../app/entity/Role'

declare module 'egg' {
  interface Context {
    entity: {
      Manager: typeof EntityManager
      Oauth: typeof EntityOauth
      Rights: typeof EntityRights
      Role: typeof EntityRole
    }
    repo: {
      Manager: Repository<EntityManager>
      Oauth: Repository<EntityOauth>
      Rights: Repository<EntityRights>
      Role: Repository<EntityRole>
    }
  }
}
