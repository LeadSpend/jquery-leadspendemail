LeadSpend Email Validation jQuery Plugin
===================
Validate your email addresses without writing a single line of code!  The LeadSpend Email Validation jQuery Plugin automatically validates email addresses
as soon as they are typed in, and is designed to work well with your current site no matter how you're validating the form.


Zero-Configuration Usage
-------------------
This plugin was designed to work right out of the box with zero-configuration.  All you need to do is:
* Import jquery
* Import jquery-leadspendemailvalidation
* Add the class "leadSpendEmail" to the email input on your form
* The LeadSpend result will appear in a hidden input on your form


Custom Usage and Options
-------------------
LeadSpend Email Validation is also a fully featured jQuery plugin.  This means that it is called using a jQuery selector, and can be
passed an map of options, or [PlainObject](http://api.jquery.com/Types/#PlainObject) as follows:

```javascript
$(function(){
  $('{email-input-selector}').leadSpendValidate( options );
});
```

### Options
The following options may be passed to the plugin:
<table>
<tbody>
<tr><th>Name</th><th>Description</th><th>Value</th></tr>
<tr><td>timeout</td><td>The timeout, in seconds.</td><td>Integer (in the range [3, 15])</td></tr>
<tr><td>resultInputSuffix</td><td>The suffix to append to the hidden result input.</td><td>String</td></tr>
<tr><td>debug</td><td>Enables console logging of events/data.</td><td>Boolean</td></tr>
</tbody>
</table>


Accessing the Result
-------------------

The email validation result will be stored in a hidden input as part of your form.  This input will have the following attributes:
* name = "{name of your email input}-result"
* id = "{id of your email input}-result" (or "" if ID was not set on your form)
* class = "leadSpendEmail-result"

Note: If a custom resultInputSuffix is used, "-result" will be replaced by it.

Result Codes and What They Mean
-------------------
LeadSpend defines the validity of an email address as follows:

<table>
<tbody>
<tr><th>Value</th><th>Description</th></tr>
<tr><td>verified</td><td>Mailbox exists, is reachable, and not known to be illegitimate or disposable.</td></tr>
<tr><td>disposable</td><td>Domain is administered by disposable email provider (e.g. Mailinator).</td></tr>
<tr><td>unreachable</td><td>Domain has no reachable mail exchangers (see discussion, below).</td></tr>
<tr><td>illegitimate</td><td>Seed, spamtrap, black hole, technical role account or inactive domain.</td></tr>
<tr><td>undeliverable</td><td>Mailbox or domain does not exist, or mailbox is full, suspended or disabled.</td></tr>
<tr><td>unknown</td><td>We were unable to conclusively verify or invalidate this address.</td></tr>
</tbody>
</table>

More detail can be found at our [API Documentation](https://github.com/LeadSpend/api-v2/blob/master/README.md#a-2-validity).

In addition to these result codes, this plugin defines two status codes as follows:

<table>
<tbody>
<tr><th>Value</th><th>Description</th></tr>
<tr><td>pending</td><td>The email validation API call has not yet completed.</td></tr>
<tr><td>error</td><td>There was an error while making the API call to the LeadSpend servers.</td></tr>
</tbody>
</table>


Demo Form
-------------------
See the demo folder for an example of the plugin.