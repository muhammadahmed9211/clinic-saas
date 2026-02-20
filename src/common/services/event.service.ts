import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from './event.type';
import { EventService } from 'src/events/event.service';
import { ActiveLogDto } from 'src/events/dto/active-log-create.dto';

@Injectable()
export class EventHandlService {
  constructor(private readonly service: EventService) { }

  // compareObjects(obj1, obj2) {
  //   const changes = {
  //     from: {},
  //     to: {},
  //   };

  //   function flattenObject(obj, prefix = '') {
  //     const flatObj = {};
  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         const newKey = prefix ? `${prefix}.${key}` : key;
  //         if (
  //           typeof obj[key] === 'object' &&
  //           obj[key] !== null &&
  //           !Array.isArray(obj[key])
  //         ) {
  //           Object.assign(flatObj, flattenObject(obj[key], newKey));
  //         } else {
  //           flatObj[newKey] = obj[key];
  //         }
  //       }
  //     }
  //     return flatObj;
  //   }

  //   const flatObj1 = flattenObject(obj1);
  //   const flatObj2 = flattenObject(obj2);

  //   function compareKeys(key) {
  //     if (flatObj1[key] !== flatObj2[key]) {
  //       if (flatObj1[key] !== undefined) {
  //         changes.from[key] = flatObj1[key];
  //       }
  //       if (flatObj2[key] !== undefined) {
  //         changes.to[key] = flatObj2[key];
  //       }
  //     }
  //   }

  //   for (const key in flatObj1) {
  //     compareKeys(key);
  //   }

  //   for (const key in flatObj2) {
  //     if (!(key in flatObj1)) {
  //       compareKeys(key);
  //     }
  //   }

  //   for (const key in changes.to) {
  //     if (changes.to[key] === undefined) {
  //       delete changes.to[key];
  //       delete changes.from[key];
  //     }
  //   }

  //   return changes;
  // }
  compareObjects(obj1, obj2) {
    const changes = {
      from: {},
      to: {},
    };

    function isObject(val) {
      return typeof val === 'object' && val !== null && !Array.isArray(val);
    }

    function isArray(val) {
      return Array.isArray(val);
    }

    function flattenObject(obj, prefix = '') {
      const flatObj = {};

      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (isObject(value)) {
          Object.assign(flatObj, flattenObject(value, newKey));
        } else if (isArray(value)) {
          // Special handling for `question` array — flatten only first matching object
          if (key === 'question' && value.length > 0 && isObject(value[0])) {
            value.forEach((item) => {
              Object.assign(flatObj, flattenObject(item, newKey));
            });
          } else {
            value.forEach((item, index) => {
              const arrayKey = `${newKey}[${index}]`;
              if (isObject(item)) {
                Object.assign(flatObj, flattenObject(item, arrayKey));
              } else {
                flatObj[arrayKey] = item;
              }
            });
          }
        } else {
          flatObj[newKey] = value;
        }
      }

      return flatObj;
    }

    const flatObj1 = flattenObject(obj1);
    const flatObj2 = flattenObject(obj2);

    function compareKeys(key) {
      if (JSON.stringify(flatObj1[key]) !== JSON.stringify(flatObj2[key])) {
        if (flatObj1[key] !== undefined) {
          changes.from[key] = flatObj1[key];
        }
        if (flatObj2[key] !== undefined) {
          changes.to[key] = flatObj2[key];
        }
      }
    }

    for (const key in flatObj1) {
      compareKeys(key);
    }

    for (const key in flatObj2) {
      if (!(key in flatObj1)) {
        compareKeys(key);
      }
    }

    for (const key in changes.to) {
      if (changes.to[key] === undefined) {
        delete changes.to[key];
        delete changes.from[key];
      }
    }

    return changes;
  }

  @OnEvent(EventTypes.ACTIVE_LOG)
  async handleActivelogs(eventData: ActiveLogDto) {
    await this.service.createLog(eventData);
  }

  @OnEvent(EventTypes.USER_LOG)
  async handleUserlogs(eventData: any) {
    if (!eventData.newData || !eventData.oldData) {
      return await this.service.createUserLog({
        leftValue: eventData.oldData ? JSON.stringify(eventData.oldData) : '',
        rightValue: eventData.newData ? JSON.stringify(eventData.newData) : '',
        entity_id: eventData.entityId,
        entity_type: eventData.entityType,
        parent_id: eventData.parentId,
        parent_type: eventData.parentType,
        performer_id: eventData.performerId,
        performer_type: eventData.performerType,
        field: eventData.field,
        trigger_type: eventData.triggerType || '',
        action: eventData.action || '',
      });
    }
    // let data: any | null;
    // let data2: any | null;

    // if (eventData.newData) {
    //   data = Object.entries(eventData.newData).map(([key, value]) => {
    //     return { key, value };
    //   });
    // }

    // if (eventData.oldData) {
    //   data2 = Object.entries(eventData.oldData).map(([key, value]) => {
    //     return { key, value };
    //   });
    // }

    // const data3: object[] = [];

    // for await (const iterator of data) {
    //   data3.push(data2?.filter((val) => val.key === iterator.key)[0]);
    // }

    // const singleObject = data3.reduce((accumulator, current: any) => {
    //   accumulator[current?.key] = current?.value;
    //   return accumulator;
    // }, {});

    const changes = this.compareObjects(eventData.oldData, eventData.newData);

    const toKeys = Object.keys(changes.to);

    changes.from = Object.keys(changes.from)
      .filter((key) => toKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = changes.from[key];
        return obj;
      }, {});

    await this.service.createUserLog({
      leftValue: JSON.stringify(changes.from),
      rightValue: JSON.stringify(changes.to),
      entity_id: eventData.entityId,
      entity_type: eventData.entityType,
      parent_id: eventData.parentId,
      parent_type: eventData.parentType,
      performer_id: eventData.performerId,
      performer_type: eventData.performerType,
      field: eventData.field,
      trigger_type: eventData.triggerType || '',
      action: eventData.action || '',
    });
  }
}