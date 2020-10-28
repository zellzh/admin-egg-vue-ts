// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityManager from '../app/entity/Manager'
import EntityMgsRoles from '../app/entity/MgsRoles'
import EntityOauth from '../app/entity/Oauth'
import EntityRights from '../app/entity/Rights'
import EntityRole from '../app/entity/Role'
import EntityRolesRights from '../app/entity/RolesRights'

declare module 'egg' {
  interface Context {
    entity: {
      Manager: typeof EntityManager
      MgsRoles: typeof EntityMgsRoles
      Oauth: typeof EntityOauth
      Rights: typeof EntityRights
      Role: typeof EntityRole
      RolesRights: typeof EntityRolesRights
    }
    repo: {
      Manager: Repository<EntityManager>
      MgsRoles: Repository<EntityMgsRoles>
      Oauth: Repository<EntityOauth>
      Rights: Repository<EntityRights>
      Role: Repository<EntityRole>
      RolesRights: Repository<EntityRolesRights>
    }
  }
}
