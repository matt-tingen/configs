// Based on https://github.com/wincent/wincent/blob/master/roles/dotfiles/support/karabiner.js
// Commit e8a0341db0d27fee07395397137c68c3100eed37

function fromTo(from, to, toType = 'key_code') {
  return [
    {
      from: {
        key_code: from,
      },
      to: {
        [toType]: to,
      },
    },
  ];
}

function bundleIdentifier(identifier) {
  return '^' + identifier.replace(/\./g, '\\.') + '$';
}

function buildSecondLayerMapping(from, to) {
  return {
    from: {
      key_code: from,
      modifiers: {
        mandatory: ['right_command'],
        optional: ['any'],
      },
    },
    // https://pqrs.org/osx/karabiner/json.html#typical-complex_modifications-examples-disable-command-l-on-finder
    ...(to && {
      to: [
        {
          key_code: to,
        },
      ],
    }),
    type: 'basic',
  };
}

function swap(a, b) {
  return [...fromTo(a, b), ...fromTo(b, a)];
}

const DEVICE_DEFAULTS = {
  disable_built_in_keyboard_if_exists: false,
  fn_function_keys: [],
  ignore: false,
  manipulate_caps_lock_led: true,
  simple_modifications: [],
};

const IDENTIFIER_DEFAULTS = {
  is_keyboard: true,
  is_pointing_device: false,
};

const APPLE_INTERNAL_US = {
  ...DEVICE_DEFAULTS,
  identifiers: {
    ...IDENTIFIER_DEFAULTS,
    product_id: 628,
    vendor_id: 1452,
  },
};

const APPLE_EXTERNAL_US = {
  ...DEVICE_DEFAULTS,
  identifiers: {
    ...IDENTIFIER_DEFAULTS,
    product_id: 620,
    vendor_id: 76,
  },
  ignore: false,
  manipulate_caps_lock_led: true,
  simple_modifications: [
    ...fromTo('f14', 'play_or_pause', 'consumer_key_code'),
    ...fromTo('f15', 'fastforward', 'consumer_key_code'),
  ],
};

const PARAMETER_DEFAULTS = {
  'basic.simultaneous_threshold_milliseconds': 50,
  'basic.to_delayed_action_delay_milliseconds': 500,
  'basic.to_if_alone_timeout_milliseconds': 1000,
  'basic.to_if_held_down_threshold_milliseconds': 500,
};

const VANILLA_PROFILE = {
  complex_modifications: {
    parameters: PARAMETER_DEFAULTS,
    rules: [],
  },
  devices: [],
  fn_function_keys: [
    // ...fromTo('f1', 'display_brightness_decrement'),
    // ...fromTo('f2', 'display_brightness_increment'),
    // ...fromTo('f3', 'mission_control'),
    // ...fromTo('f4', 'launchpad'),
    // ...fromTo('f5', 'illumination_decrement'),
    // ...fromTo('f6', 'illumination_increment'),
    // ...fromTo('f7', 'rewind'),
    // ...fromTo('f8', 'play_or_pause'),
    // ...fromTo('f9', 'fastforward'),
    // ...fromTo('f10', 'mute'),
    // ...fromTo('f11', 'volume_decrement'),
    // ...fromTo('f12', 'volume_increment'),
  ],
  name: 'Vanilla',
  selected: false,
  simple_modifications: [],
  virtual_hid_keyboard: {
    caps_lock_delay_milliseconds: 0,
    keyboard_type: 'ansi',
  },
};

function isObject(item) {
  return (
    item !== null && Object.prototype.toString.call(item) === '[object Object]'
  );
}

function deepCopy(item) {
  if (Array.isArray(item)) {
    return item.map(deepCopy);
  } else if (isObject(item)) {
    const copy = {};
    Object.entries(item).forEach(([k, v]) => {
      copy[k] = deepCopy(v);
    });
    return copy;
  }
  return item;
}

/**
 * Visit the data structure, `item`, navigating to `path` and passing the
 * value(s) at that location into the `updater` function, which may return a
 * substitute value or the original item (if no changes are made, the original
 * item is returned).
 *
 * `path` is a tiny JSONPath subset, and may contain:
 *
 * - `$`: selects the root object.
 * - `.child`: selects a child property.
 * - `[start:end]`: selects an array slice; `end` is optional.
 */
function visit(item, path, updater) {
  const match = path.match(
    /^(?<root>\$)|\.(?<child>\w+)|\[(?<slice>.+?)\]|(?<done>$)/,
  );
  const {
    groups: { root, child, slice },
  } = match;
  const subpath = path.slice(match[0].length);
  if (root) {
    return visit(item, subpath, updater);
  } else if (child) {
    const next = visit(item[child], subpath, updater);
    if (next !== undefined) {
      return {
        ...item,
        [child]: next,
      };
    }
  } else if (slice) {
    const {
      groups: { start, end },
    } = slice.match(/^(?<start>\d+):(?<end>\d+)?$/);
    let array;
    for (let i = start, max = end == null ? item.length : end; i < max; i++) {
      const next = visit(item[i], subpath, updater);
      if (next !== undefined) {
        if (!array) {
          array = item.slice(0, i);
        }
        array[i] = next;
      } else if (array) {
        array[i] = item[i];
      }
    }
    return array;
  } else {
    const next = updater(item);
    return next === item ? undefined : next;
  }
}

const EXEMPTIONS = ['com.factorio', 'com.feralinteractive.dirtrally'];

function applyExemptions(profile) {
  const exemptions = {
    type: 'frontmost_application_unless',
    bundle_identifiers: EXEMPTIONS.map(bundleIdentifier),
  };

  return visit(
    profile,
    '$.complex_modifications.rules[0:].manipulators[0:].conditions',
    conditions => {
      if (conditions) {
        if (
          conditions.some(
            condition => condition.type === 'frontmost_application_if',
          )
        ) {
          return conditions;
        }
        return [...deepCopy(conditions), exemptions];
      } else {
        return [exemptions];
      }
    },
  );
}

const DEFAULT_PROFILE = applyExemptions({
  ...VANILLA_PROFILE,
  complex_modifications: {
    parameters: {
      ...PARAMETER_DEFAULTS,
      'basic.to_if_alone_timeout_milliseconds': 500 /* Default: 1000 */,
    },
    rules: [
      {
        description: 'Second layer',
        manipulators: [
          buildSecondLayerMapping('h', 'page_up'),
          buildSecondLayerMapping('n', 'page_down'),
          buildSecondLayerMapping('l', 'right_arrow'),
          buildSecondLayerMapping('k', 'down_arrow'),
          buildSecondLayerMapping('j', 'left_arrow'),
          buildSecondLayerMapping('i', 'up_arrow'),
          buildSecondLayerMapping('semicolon', 'delete_or_backspace'),
          buildSecondLayerMapping('quote', 'delete_forward'),
          buildSecondLayerMapping('caps_lock', 'caps_lock'),
          buildSecondLayerMapping('1', 'f1'),
          buildSecondLayerMapping('2', 'f2'),
          buildSecondLayerMapping('3', 'f3'),
          buildSecondLayerMapping('4', 'f4'),
          buildSecondLayerMapping('5', 'f5'),
          buildSecondLayerMapping('6', 'f6'),
          buildSecondLayerMapping('7', 'f7'),
          buildSecondLayerMapping('8', 'f8'),
          buildSecondLayerMapping('9', 'f9'),
          buildSecondLayerMapping('0', 'f10'),
          buildSecondLayerMapping('tab', null),
        ],
      },
      {
        description: 'caps_lock without shift to escape',
        manipulators: [
          {
            type: 'basic',
            from: {
              key_code: 'caps_lock',
              modifiers: {
                mandatory: ['shift'],
                optional: ['caps_lock'],
              },
            },
            to: [
              {
                key_code: 'caps_lock',
              },
            ],
          },
          {
            type: 'basic',
            from: {
              key_code: 'caps_lock',
              modifiers: {
                optional: ['any'],
              },
            },
            to: [
              {
                key_code: 'escape',
              },
            ],
          },
        ],
      },
    ],
  },
  devices: [APPLE_INTERNAL_US, APPLE_EXTERNAL_US],
  name: 'Default',
  selected: true,
});

const CONFIG = {
  global: {
    check_for_updates_on_startup: true,
    show_in_menu_bar: true,
    show_profile_name_in_menu_bar: false,
  },
  profiles: [DEFAULT_PROFILE, VANILLA_PROFILE],
};

if (require.main === module) {
  // Script is being executed directly.
  process.stdout.write(JSON.stringify(CONFIG, null, 2) + '\n');
} else {
  // File is being `require`-ed as a module.
  module.exports = {
    bundleIdentifier,
    deepCopy,
    isObject,
    visit,
  };
}
