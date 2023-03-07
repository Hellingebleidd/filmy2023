import { Pipe, PipeTransform } from '@angular/core';
import { Group } from 'src/entities/group';

@Pipe({
  name: 'groupsToString',
})
export class GroupsToStringPipe implements PipeTransform {
  transform(groups: Group[], options?: string): string {
    if (options === 'perms') {
      return groups
        .flatMap((g) => g.permissions)
        .reduce((acc: string[], p) => (acc.includes(p) ? acc : [...acc, p]), [])
        .join(', ');
    }
    return groups.map((g) => g.name).join(', ');
  }
}
