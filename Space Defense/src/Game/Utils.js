/**
 * Call super method of the given object and method.
 * This function create a temporary variable called "_call_base_reference",
 * to inspect whole inheritance linage. It will be deleted at the end of inspection.
 *
 * Usage : Inside your method use call_base(this, 'method_name', arguments);
 *
 * @param {object} object The owner object of the method and inheritance linage
 * @param {string} method The name of the super method to find.
 * @param {array} args The calls arguments, basically use the "arguments" special variable.
 * @returns {*} The data returned from the super method.
 */
function call_base(object, method, args) {
    // We get base object, first time it will be passed object,
    // but in case of multiple inheritance, it will be instance of parent objects.
    var base = object.hasOwnProperty('_call_base_reference') ? object._call_base_reference : object,
    // We get matching method, from current object,
    // this is a reference to define super method.
            object_current_method = base[method],
    // Temp object wo receive method definition.
            descriptor = null,
    // We define super function after founding current position.
            is_super = false,
    // Contain output data.
            output = null;
    while (base !== undefined) {
        // Get method info
        descriptor = Object.getOwnPropertyDescriptor(base, method);
        if (descriptor !== undefined) {
            // We search for current object method to define inherited part of chain.
            if (descriptor.value === object_current_method) {
                // Further loops will be considered as inherited function.
                is_super = true;
            }
            // We already have found current object method.
            else if (is_super === true) {
                // We need to pass original object to apply() as first argument,
                // this allow to keep original instance definition along all method
                // inheritance. But we also need to save reference to "base" who
                // contain parent class, it will be used into this function startup
                // to begin at the right chain position.
                object._call_base_reference = base;
                // Apply super method.
                output = descriptor.value.apply(object, args);
                // Property have been used into super function if another
                // call_base() is launched. Reference is not useful anymore.
                delete object._call_base_reference;
                // Job is done.
                return output;
            }
        }
        // Iterate to the next parent inherited.
        base = Object.getPrototypeOf(base);
    }
}

function get_angle_between(angle1, angle2) {
  var deltaAng = angle2 - angle1;
  if (deltaAng < -Math.PI) { deltaAng += Math.PI * 2; }
  else if (deltaAng > Math.PI) { deltaAng -= Math.PI * 2; }
  return deltaAng;
}

function get_angle_to_point(point1, point2) {
  return Math.atan2(
    point2.y - point1.y,
    point2.x - point1.x
  );
}

function dist(point1, point2) {
  return ((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) ** 0.5
}

function get_highest_priority_in_list(list, priorityCallback) {
  var highestPri = 0;
  var selected = [];
  for (var key in list) {
    var elementPri = priorityCallback(list[key]);
    if (
      !highestPri && elementPri > 0
      || elementPri > highestPri
    ) {
      highestPri = elementPri;
      selected = [list[key]]
    } else if (elementPri > 0 && elementPri == highestPri) {
      selected.push(list[key]);
    }
  }
  return selected;
}
